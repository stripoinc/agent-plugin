#!/usr/bin/env node

import { existsSync } from "node:fs";
import { copyFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";

import {
  collectBackgroundStyles,
  collectButtonStyles,
  collectCaptureArtifacts,
  collectDomHierarchy,
  collectLanguageSubtree,
  collectPageSignals,
  collectProductCardStyles,
  collectProductData,
  collectTextStyles,
  createPageOverlayController,
  detectLandedDocumentError,
  detectSecurityInterstitial,
  deriveArtifactPath,
  openPage,
  parseArgs,
  resolveContentTypeByUrl,
  selectorSummary,
  writeJson,
} from "./lib.js";
import { emptyProductDataArtifact } from "./lib/product-data.js";
import { collectLogoAssets, emptyLogoAssetsArtifact } from "./lib/logo-asset-capture.js";
import { collectInlineSvgLogos } from "./lib/inline-svg-logo-capture.js";
import { buildProbedSelectorsRecord, probedSelectorsPathFor } from "./lib/probed-selectors.js";
import { DEFAULT_TEXT_SELECTORS } from "./lib/default-text-selectors.js";
import { collectSalientText, emptySalientTextArtifact } from "./lib/salient-text.js";
import { createButtonProbeDiagnostics } from "./lib/button-probe-diagnostics.js";
import { rankLogoCandidates } from "./assemble-candidates.js";
import {
  blockedBySecurityInterstitialClaim,
  browserHandleToRelease,
  captureForCanonicalArtifact,
  initialFallbackStatus,
  selectHomepageAttempt,
  shouldAttemptResidentialFallback,
} from "./lib/homepage-attempt-selection.js";

const DEFAULT_BACKGROUND_SELECTORS = ["body", "header", "main", "footer"];
const DEFAULT_BUTTON_SELECTORS = [
  "button[class*='buy']",
  "button[class*='cart']",
  "button[class*='add']",
  "button[class*='order']",
  "[role='button'][class*='buy']",
  "[role='button'][class*='cart']",
  "a[href][class*='buy']",
  "a[href][class*='cart']",
  "button",
  "[role='button']",
  "a[href][class*='btn']",
  "a[href][class*='button']",
];
const DEFAULT_PRODUCT_CARD_SELECTORS = [
  "[class*='product-card']",
  "[class*='card'][class*='product']",
  "[data-product]",
  "[class*='product-item']",
  "[class*='catalog-item']",
  "[class*='goods-item']",
  "[class*='goodsItem']",
  "[class*='item-card']",
  "[class*='card-item']",
  "[class*='product']",
  "article",
];
const DEFAULT_PRICE_SELECTORS = [
  ".price",
  "[class*='price']",
  "[class*='Price']",
  "[data-price]",
  ".sum",
  "[class*='sum']",
  "[class*='Sum']",
  "[class*='cost']",
  "[class*='Cost']",
  "[class*='amount']",
  "[class*='Amount']",
];
const DEFAULT_OLD_PRICE_SELECTORS = [
  ".old-price",
  "[class*='old-price']",
  "[class*='oldPrice']",
  "[class*='OldPrice']",
  "[class*='was-price']",
  "[class*='strikethrough']",
  "[class*='strike-through']",
  "[class*='strike']",
  // Tailwind utility class — Nuxt/Vue/React shops commonly mark
  // strikethrough old prices via the literal `line-through` utility class
  // rather than a site-specific class name.
  "[class*='line-through']",
  "[class*='lineThrough']",
  // Shopify / BigCommerce / WooCommerce / Magento conventions.
  "[class*='compare-at']",
  "[class*='compareAt']",
  "[class*='comparePrice']",
  "[class*='regular-price']",
  "[class*='regularPrice']",
  "[class*='original-price']",
  "[class*='originalPrice']",
  "[class*='price-old']",
  "[class*='price__old']",
  "[class*='priceOld']",
  // Native HTML elements that often (but not always) mark old prices.
  "s",
  "del",
];
const DEFAULT_CTA_SELECTORS = [
  "[class*='buy-button']",
  "[class*='add-to-cart']",
  "[class*='buy']",
  "[class*='cart']",
  "[class*='order']",
  "button[class*='btn']",
  "button[class*='button']",
  "a[href][class*='buy']",
  "a[href][class*='cart']",
  "a[href][class*='btn']",
  "a[href][class*='button']",
  "[role='button']",
  "button",
];
const HOMEPAGE_PASS_HEARTBEAT_INTERVAL_MS = 5000;

const args = parseArgs(process.argv.slice(2));

if (!args.outDir) {
  throw new Error("Missing required flag: --out-dir <directory>");
}

selectorSummary(args.selectors);

const backgroundSelectors = args.backgroundSelectors.length
  ? args.backgroundSelectors
  : (args.selectors.length ? args.selectors : DEFAULT_BACKGROUND_SELECTORS);
const textSelectors = args.textSelectors.length
  ? args.textSelectors
  : (args.selectors.length ? args.selectors : DEFAULT_TEXT_SELECTORS);
const buttonSelectors = args.buttonSelectors.length
  ? args.buttonSelectors
  : (args.selectors.length ? args.selectors : DEFAULT_BUTTON_SELECTORS);
const productCardSelectors = args.productCardSelectors.length
  ? args.productCardSelectors
  : (args.selectors.length ? args.selectors : DEFAULT_PRODUCT_CARD_SELECTORS);
const priceSelectors = args.priceSelectors.length ? args.priceSelectors : DEFAULT_PRICE_SELECTORS;
const oldPriceSelectors = args.oldPriceSelectors.length ? args.oldPriceSelectors : DEFAULT_OLD_PRICE_SELECTORS;
const ctaSelectors = args.ctaSelectors.length ? args.ctaSelectors : DEFAULT_CTA_SELECTORS;

const artifactPaths = {
  screenshot: deriveArtifactPath(args.outDir, "home.png"),
  capture: deriveArtifactPath(args.outDir, "capture.json"),
  dom: deriveArtifactPath(args.outDir, "dom.json"),
  background: deriveArtifactPath(args.outDir, "background-styles.json"),
  text: deriveArtifactPath(args.outDir, "text-styles.json"),
  // Deliberately NOT in requiredArtifactPaths: a page with no salient text
  // must not flip readyForAssembly and trigger an agent rerun loop.
  salientText: deriveArtifactPath(args.outDir, "salient-text.json"),
  buttons: deriveArtifactPath(args.outDir, "button-styles.json"),
  // Per-row instrumentation for the button probe. Deliberately NOT in
  // requiredArtifactPaths / optionalArtifactPaths, on the same doctrine as
  // `productData` and `logoAssets`: it is an operator/diagnostics artifact the
  // agent never reads and the assembler never opens, so listing it would let a
  // degraded probe flip readyForAssembly / missingRequiredArtifacts and send
  // the agent into a rerun loop over evidence that changes no output.
  buttonDiagnostics: deriveArtifactPath(args.outDir, "button-styles.diagnostics.json"),
  productCards: deriveArtifactPath(args.outDir, "product-card-styles.json"),
  productCardRecovery: deriveArtifactPath(args.outDir, "product-card-styles.recovery.json"),
  // Demo product data. Deliberately NOT in requiredArtifactPaths /
  // optionalArtifactPaths: listing it as required would flip
  // readyForAssembly / missingRequiredArtifacts and trigger agent rerun
  // loops when the phase degrades. Downstream-only; the agent never reads it.
  productData: deriveArtifactPath(args.outDir, "product-data.json"),
  // SVG logo bytes kept from the render, plus their `*.svgpath.json`
  // sidecars under `logo-assets/`. Follows the `productData` doctrine and is
  // deliberately NOT in requiredArtifactPaths / optionalArtifactPaths: a
  // degraded logo phase must not flip readyForAssembly and send the agent
  // into a rerun loop over an artifact it never reads directly.
  logoAssets: deriveArtifactPath(args.outDir, "logo-assets.json"),
  pageSignals: deriveArtifactPath(args.outDir, "page-signals.json"),
  language: deriveArtifactPath(args.outDir, "language-subtree.json"),
  status: deriveArtifactPath(args.outDir, "homepage-pass-status.json"),
};

const requiredArtifactPaths = [
  artifactPaths.screenshot,
  artifactPaths.capture,
  artifactPaths.dom,
  artifactPaths.background,
  artifactPaths.text,
  artifactPaths.buttons,
  artifactPaths.productCards,
  artifactPaths.productCardRecovery,
  artifactPaths.pageSignals,
];

const optionalArtifactPaths = [artifactPaths.language];
const completedPhases = [];
const phaseTimingsMs = {};
const passStartedAt = Date.now();
let activePhaseName = "";
let activePhaseStartedAt = 0;
let lastKnownPageUrl = "";
let homepagePassHeartbeatPromise = null;
let securityInterstitialFallback = {
  eligible: false,
  attempted: false,
  outcome: "not_eligible",
  proxyCountry: null,
  initialBlocker: null,
};

function artifactName(path) {
  return path.split("/").pop() || path;
}

function blockedRecoverySummary(blockedPage) {
  const securityInterstitial = blockedPage?.securityInterstitial !== false;
  const failureSignals = [
    securityInterstitial
      ? "homepage-blocked-by-security-interstitial"
      : "homepage-blocked-by-landed-document-error-status",
  ];
  if (blockedPage?.provider) {
    failureSignals.push(`security-provider-${blockedPage.provider}`);
  }
  return {
    captureEvidenceUsed: true,
    attempts: [],
    failureSignals,
    bestAttempt: null,
    bestPhase: "blocked",
    finalRowCount: 0,
    finalRepresentativeRowCount: 0,
    finalPurchaseRepresentativeRowCount: 0,
    finalPurchaseCandidateRowCount: 0,
    finalHomepageCtaNotReusableCandidateRowCount: 0,
    finalPhase: "blocked",
    selectedRepresentativeRow: null,
    summary: {
      bestPhase: "blocked",
      hasRepresentativeRow: false,
      hasPurchaseLikeRepresentative: false,
      purchaseCandidateRowCount: 0,
      homepageCtaNotReusableCandidateRowCount: 0,
      homepageCtaNotReusableAsText: false,
      selectedCtaLooksPurchaseLike: false,
      selectedCtaLooksNonPurchaseLike: false,
      selectedRowLooksWrapperLike: false,
      selectedPriceLooksMergedLike: false,
      selectedProductUrl: "",
      selectedCtaText: "",
      blockedBySecurityInterstitial: securityInterstitial,
      blockerProvider: blockedPage?.provider || "unknown",
    },
  };
}

async function timePhase(name, fn) {
  const startedAt = Date.now();
  activePhaseName = name;
  activePhaseStartedAt = startedAt;
  await queueHomepagePassHeartbeat().catch(() => {});
  const heartbeat = setInterval(() => {
    queueHomepagePassHeartbeat().catch(() => {});
  }, HOMEPAGE_PASS_HEARTBEAT_INTERVAL_MS);
  if (typeof heartbeat.unref === "function") {
    heartbeat.unref();
  }
  try {
    return await fn();
  } finally {
    clearInterval(heartbeat);
    await homepagePassHeartbeatPromise?.catch(() => {});
    phaseTimingsMs[name] = Math.max(0, Date.now() - startedAt);
    activePhaseName = "";
    activePhaseStartedAt = 0;
    await writeHomepagePassStatus({
      status: "running",
      pageUrl: lastKnownPageUrl,
    }).catch(() => {});
  }
}

function queueHomepagePassHeartbeat() {
  if (!activePhaseName || !activePhaseStartedAt) {
    return Promise.resolve();
  }
  if (!homepagePassHeartbeatPromise) {
    homepagePassHeartbeatPromise = writeHomepagePassStatus({
      status: "running",
      pageUrl: lastKnownPageUrl,
      currentPhase: activePhaseName,
      currentPhaseStartedAt: activePhaseStartedAt,
    }).finally(() => {
      homepagePassHeartbeatPromise = null;
    });
  }
  return homepagePassHeartbeatPromise;
}

async function writeHomepagePassStatus({
  status,
  pageUrl = "",
  shouldCollectLanguage = false,
  pageSignalsPayload = null,
  recoverySummary = null,
  blockedPage = null,
  buttonProbeDegraded = false,
  buttonProbeError = "",
  overlaySummary = null,
  productDataSummary = null,
  errorMessage = "",
  currentPhase = activePhaseName,
  currentPhaseStartedAt = activePhaseStartedAt,
  fallbackStatus = securityInterstitialFallback,
}) {
  const requiredArtifacts = requiredArtifactPaths.map(artifactName);
  const optionalArtifacts = optionalArtifactPaths.map(artifactName);
  const writtenRequiredArtifacts = requiredArtifactPaths.filter(existsSync).map(artifactName);
  const writtenOptionalArtifacts = optionalArtifactPaths.filter(existsSync).map(artifactName);
  const missingRequiredArtifacts = requiredArtifacts.filter((name) => !writtenRequiredArtifacts.includes(name));
  const missingOptionalArtifacts = shouldCollectLanguage
    ? optionalArtifacts.filter((name) => !writtenOptionalArtifacts.includes(name))
    : [];
  const isBlocked = status === "blocked" || Boolean(blockedPage?.blocked);
  const isSecurityInterstitial = blockedBySecurityInterstitialClaim({ status, blockedPage });
  const isRunning = status === "running";
  const homepageNeedsFollowup = Boolean(
    !isRunning &&
      (isBlocked ||
      status !== "completed" ||
      missingRequiredArtifacts.length > 0),
  );
  let recommendedFollowupAction = "";
  let recommendedFollowupReason = "";
  if (isRunning) {
    recommendedFollowupAction = "wait-for-current-phase";
    recommendedFollowupReason = "homepage-pass-running";
  } else if (isBlocked) {
    recommendedFollowupAction = "abort-extraction";
    recommendedFollowupReason = isSecurityInterstitial
      ? "homepage-security-interstitial"
      : "homepage-landed-document-error-status";
  } else if (status !== "completed" || missingRequiredArtifacts.length > 0) {
    recommendedFollowupAction = "warning-level-assembly";
    recommendedFollowupReason = "homepage-pass-incomplete";
  }

  await writeJson(
    {
      pass: "homepage",
      status,
      pageUrl,
      startedAtMs: passStartedAt,
      updatedAtMs: Date.now(),
      currentPhase: currentPhase || null,
      currentPhaseElapsedMs: currentPhaseStartedAt ? Math.max(0, Date.now() - currentPhaseStartedAt) : null,
      completedPhases: [...completedPhases],
      requiredArtifacts,
      optionalArtifacts,
      writtenArtifacts: [...writtenRequiredArtifacts, ...writtenOptionalArtifacts],
      missingRequiredArtifacts,
      missingOptionalArtifacts,
      readyForAssembly:
        !isBlocked &&
        !isRunning &&
        status === "completed" &&
        missingRequiredArtifacts.length === 0,
      degraded: homepageNeedsFollowup,
      requiresFollowup: homepageNeedsFollowup,
      recommendedFollowupAction,
      recommendedFollowupReason: recommendedFollowupReason || null,
      blockedBySecurityInterstitial: isSecurityInterstitial,
      blocker: isBlocked
        ? {
            type: blockedPage?.type || "security_interstitial",
            provider: blockedPage?.provider || "unknown",
            confidence: blockedPage?.confidence || "medium",
            title: blockedPage?.title || "",
            evidence: Array.isArray(blockedPage?.evidence) ? blockedPage.evidence : [],
          }
        : null,
      securityInterstitialFallback: fallbackStatus,
      phaseTimingsMs: {
        ...phaseTimingsMs,
        total: Math.max(0, Date.now() - passStartedAt),
      },
      buttonProbeDegraded,
      buttonProbeError: buttonProbeError || null,
      // Overlays that covered a hover target (lib/overlay-dismissal.js):
      // how many pointer hovers were refused for intercepting pointer
      // events, and what was tried against each interceptor. Counts, never a
      // threshold -- `buttonProbeDegraded` keeps its meaning (the probe
      // threw). Null until the hover probes have run.
      hoverIntercepted: overlaySummary?.hoverIntercepted ?? 0,
      overlays: overlaySummary,
      // Additive: demo product-data phase summary (null while not yet run).
      productData: productDataSummary,
      pageSignalsSummary: pageSignalsPayload
        ? {
        visibleLanguageHintCount: Array.isArray(pageSignalsPayload.visibleLanguageHints)
          ? pageSignalsPayload.visibleLanguageHints.length
          : 0,
        documentLanguageHintCount: Array.isArray(pageSignalsPayload.documentLanguageHints)
          ? pageSignalsPayload.documentLanguageHints.length
          : 0,
        socialCount: Array.isArray(pageSignalsPayload.socials) ? pageSignalsPayload.socials.length : 0,
        importantLinkCount: Array.isArray(pageSignalsPayload.importantLinks)
          ? pageSignalsPayload.importantLinks.length
              : 0,
          }
        : null,
      productCardRecovery: recoverySummary
        ? {
            finalPhase: recoverySummary?.finalPhase || "initial",
            failureSignals: Array.isArray(recoverySummary?.failureSignals) ? recoverySummary.failureSignals : [],
            summary: recoverySummary?.summary || null,
          }
        : null,
      error: errorMessage || null,
    },
    artifactPaths.status,
    args.pretty,
  );
}

const temporaryScreenshotPaths = {
  standard: path.join(os.tmpdir(), `brandkit-home-standard-${randomUUID()}.png`),
  fallback: path.join(os.tmpdir(), `brandkit-home-residential-${randomUUID()}.png`),
};
let browser = null;
let context = null;
let page = null;
let observedAssetUrls = new Set();
let observedRequests = () => [];
let logoBodyCache = null;
// The sanitized actions openPage actually ran to reach the SELECTED render.
// `collectAttempt` is what feeds them into capture.json; this binding keeps the
// selected attempt's state complete so any later code in this block reads the
// same attempt's actions rather than the standard attempt's.
let executedActions = [];

// The blocker a landed non-2xx document raises. NOT an interstitial claim:
// this says "the document we got was not the page", which is a different fact
// from "the page is showing us a challenge", and the artifact has to keep them
// apart -- see `blockedBySecurityInterstitialClaim`.
//
// `fallbackEligible: false` is load-bearing. A residential egress cannot turn
// a 404 into a 200, so engaging the fallback would burn one paid Browserbase
// session per wrong URL and end on the same status.
function landedDocumentErrorBlocker(documentError, title) {
  return {
    blocked: true,
    securityInterstitial: false,
    type: "landed_document_error_status",
    provider: "",
    confidence: "high",
    fallbackEligible: false,
    fallbackReason: "landed_document_error_status_is_not_an_egress_problem",
    title,
    evidence: documentError.evidence,
    documentStatus: documentError.status,
    documentUrl: documentError.url,
  };
}

async function collectAttempt(opened, screenshotPath, phasePrefix = "") {
  const capturePayload = await timePhase(`${phasePrefix}capture`, () => collectCaptureArtifacts(opened.page, {
    args,
    screenshotPath,
    observedAssetUrls: opened.observedAssetUrls,
    observedRequests: opened.observedRequests,
    mainFrameNavigations: opened.mainFrameNavigations,
    executedActions: opened.executedActions,
  }));
  const domPayload = await timePhase(`${phasePrefix}dom`, () => collectDomHierarchy(opened.page));
  const pageSignalsPayload = await timePhase(`${phasePrefix}pageSignals`, () => collectPageSignals(opened.page));
  const securityBlocker = detectSecurityInterstitial({ capturePayload, domPayload, pageSignalsPayload });
  const documentError = detectLandedDocumentError({ capturePayload });
  // A live challenge keeps its own classification even when the document also
  // errored: it is the more specific claim, it names the provider, and it is
  // the one a residential retry can still clear.
  const blockedPage = securityBlocker.blocked || !documentError.blocked
    ? { ...securityBlocker, securityInterstitial: securityBlocker.blocked }
    : landedDocumentErrorBlocker(documentError, securityBlocker.title);
  return {
    ...opened,
    opened: true,
    screenshotPath,
    capturePayload,
    domPayload,
    pageSignalsPayload,
    blockedPage,
  };
}

try {
  const standardOpened = await timePhase("openPage", () => openPage(args));
  // Own the paid handle immediately. Any capture/DOM/signals failure below
  // still reaches the outer finally and releases this session.
  browser = standardOpened.browser;
  context = standardOpened.context;
  page = standardOpened.page;
  lastKnownPageUrl = standardOpened.page.url();
  const standardAttempt = await collectAttempt(
    standardOpened,
    temporaryScreenshotPaths.standard,
  );
  securityInterstitialFallback = initialFallbackStatus(
    standardAttempt.blockedPage,
    standardAttempt.browserbaseSession,
  );

  let fallbackAttempt = null;
  let standardBrowserSpent = false;
  if (shouldAttemptResidentialFallback(securityInterstitialFallback)) {
    securityInterstitialFallback = {
      ...securityInterstitialFallback,
      attempted: true,
      outcome: "starting",
    };
    let fallbackOpened = null;
    try {
      // Set BEFORE the call, not after it. The connector closes this browser —
      // and lib.js's wrapped close releases its session — before it mints
      // anything, so by the time any of the three failure outcomes below is
      // known the standard handle is already spent. See
      // `browserHandleToRelease`.
      standardBrowserSpent = true;
      fallbackOpened = await timePhase("fallbackOpenPage", () => openPage(args, {
        blockedFallbackSource: {
          browser: standardAttempt.browser,
          sessionId: standardAttempt.browserbaseSession.sessionId,
        },
      }));
      // Switch ownership as soon as the fallback page opens. If its evidence
      // collection fails, the catch closes it before retaining the initial
      // proven blocked result.
      browser = fallbackOpened.browser;
      context = fallbackOpened.context;
      page = fallbackOpened.page;
      lastKnownPageUrl = fallbackOpened.page.url();
      fallbackAttempt = await collectAttempt(
        fallbackOpened,
        temporaryScreenshotPaths.fallback,
        "fallback",
      );
      securityInterstitialFallback = {
        ...securityInterstitialFallback,
        outcome: fallbackAttempt.blockedPage.blocked ? "still_blocked" : "completed",
        proxyCountry: fallbackAttempt.browserbaseSession?.proxyCountry || null,
      };
    } catch (error) {
      await fallbackOpened?.browser?.close?.().catch(() => {});
      const code = typeof error?.code === "string" ? error.code : "";
      securityInterstitialFallback = {
        ...securityInterstitialFallback,
        outcome: code === "fallback_release_failed"
          ? "release_failed"
          : (code === "session_create_failed" ? "mint_failed" : "open_failed"),
      };
    }
  }

  const selectedAttempt = selectHomepageAttempt({ standardAttempt, fallbackAttempt });
  ({ context, page, observedAssetUrls, observedRequests, executedActions, logoBodyCache } =
    selectedAttempt);
  // NOT `selectedAttempt.browser`: after a failed fallback the standard
  // attempt's evidence is still the right answer but its browser is already
  // closed and released, and the outer finally must not release it twice.
  browser = browserHandleToRelease({
    selectedAttempt,
    standardAttempt,
    standardBrowserSpent,
  });
  lastKnownPageUrl = selectedAttempt.page.url();
  await copyFile(selectedAttempt.screenshotPath, artifactPaths.screenshot);
  const capturePayload = captureForCanonicalArtifact(selectedAttempt, artifactPaths.screenshot);
  await writeJson(capturePayload, artifactPaths.capture, args.pretty);
  completedPhases.push("capture");
  const domPayload = selectedAttempt.domPayload;
  await writeJson(domPayload, artifactPaths.dom, args.pretty);
  completedPhases.push("dom");
  const pageSignalsPayload = selectedAttempt.pageSignalsPayload;
  await writeJson(pageSignalsPayload, artifactPaths.pageSignals, args.pretty);
  completedPhases.push("pageSignals");
  const blockedPage = selectedAttempt.blockedPage;
  if (blockedPage.blocked) {
    const recoverySummary = blockedRecoverySummary(blockedPage);
    await writeJson([], artifactPaths.background, args.pretty);
    await writeJson([], artifactPaths.text, args.pretty);
    await writeJson([], artifactPaths.productCards, args.pretty);
    await writeJson(recoverySummary, artifactPaths.productCardRecovery, args.pretty);
    await writeJson([], artifactPaths.buttons, args.pretty);
    const blockedProductData = emptyProductDataArtifact({
      pageUrl: page.url(),
      status: "blocked",
    });
    await writeJson(blockedProductData, artifactPaths.productData, args.pretty);
    await writeJson(emptyLogoAssetsArtifact({ status: "blocked" }), artifactPaths.logoAssets, args.pretty);
    // Scrubbed like every other capture here. An interstitial's most prominent
    // text IS a Cloudflare challenge string, and persisting it as "the page's
    // salient text" would outlive the block until some later pass overwrote it.
    await writeJson(emptySalientTextArtifact({ status: "blocked" }), artifactPaths.salientText, args.pretty);
    completedPhases.push("blocked");
    await writeHomepagePassStatus({
      status: "blocked",
      pageUrl: page.url(),
      shouldCollectLanguage: false,
      pageSignalsPayload,
      recoverySummary,
      blockedPage,
      productDataSummary: { written: true, count: 0, status: "blocked" },
    });
    completedPhases.push("status");
    await writeJson(
      {
        url: page.url(),
        artifacts: artifactPaths,
        status: "blocked",
        blockedBySecurityInterstitial: blockedPage.securityInterstitial !== false,
        blocker: {
          type: blockedPage.type,
          provider: blockedPage.provider,
          confidence: blockedPage.confidence,
          title: blockedPage.title,
          evidence: blockedPage.evidence,
        },
        statusPath: artifactPaths.status,
      },
      "",
      args.pretty,
    );
  } else {
  const backgroundPayload = await timePhase("backgroundStyles", () => collectBackgroundStyles(page, backgroundSelectors));
  await writeJson(backgroundPayload, artifactPaths.background, args.pretty);
  completedPhases.push("backgroundStyles");

  const textPayload = await timePhase("textStyles", () => collectTextStyles(page, textSelectors));
  // Sidecar FIRST: a killed probe must not pair a narrow capture with a stale
  // wide selector record.
  await writeJson(
    buildProbedSelectorsRecord(textSelectors),
    probedSelectorsPathFor(artifactPaths.text),
    args.pretty,
  );
  await writeJson(textPayload, artifactPaths.text, args.pretty);
  completedPhases.push("textStyles");

  // Selector-free salient text. Runs HERE, on the NOT-blocked branch, for two
  // reasons: an interstitial's most prominent text is its challenge string,
  // and a blocked page is not worth a page evaluate.
  //
  // Degrades like productData and logoAssets: the artifact is ALWAYS written,
  // empty on failure, and never gates assembly readiness. Nothing reads it
  // yet, so an evaluate fault here must not kill a run that completes today —
  // this stack's whole requirement is that extraction stops failing.
  let salientPayload;
  try {
    salientPayload = await timePhase("salientText", () => collectSalientText(page));
  } catch (error) {
    salientPayload = emptySalientTextArtifact({
      status: "failed",
      error: String(error?.message || error).slice(0, 300),
    });
  }
  await writeJson(salientPayload, artifactPaths.salientText, args.pretty);
  completedPhases.push("salientText");

  // Logo-asset capture. Runs HERE — right after pageSignals, before
  // productCardStyles / buttonStyles (which can take 100s+) — because the
  // retained response bodies live in the CDP cache and the browser can evict
  // them; the sooner they are read out, the more survive.
  //
  // Candidate list is `rankLogoCandidates`' own output, so the set we spend
  // Tier-2 navigations on is exactly what the scaffolder will later score.
  // `contentTypeByUrl` from `observedRequests()` rescues extensionless CDN
  // URLs whose SVG-ness is only visible in the response header.
  // `resolveContentTypeByUrl` is what collapses the container's several
  // records per URL to one, from what the server said rather than from where
  // a record sits in the container -- see its comment in lib.js.
  //
  // The INLINE scan runs in the same phase and on the same page, because a
  // logo the site ships as inline `<svg>` markup is never requested at all —
  // there is no response for either tier to keep, and without this the site
  // ships a favicon-only brandkit. See lib/inline-svg-logo-capture.js.
  //
  // Degrades like productData: the artifact is ALWAYS written, empty on
  // failure, and never gates assembly readiness.
  let logoAssetsPayload;
  try {
    logoAssetsPayload = await timePhase("logoAssets", async () => {
      const contentTypeByUrl = resolveContentTypeByUrl(observedRequests());
      // Started, deliberately NOT awaited here: `collectLogoAssets`'s first
      // act is to settle the Tier-1 bodies out of the evictable CDP cache, and
      // nothing may delay that. It awaits this promise itself, last.
      const inlineScan = collectInlineSvgLogos(page);
      const payload = await collectLogoAssets({
        cache: logoBodyCache,
        context,
        candidateUrls: rankLogoCandidates(capturePayload, pageSignalsPayload).map(
          (candidate) => candidate?.value?.url,
        ),
        contentTypeByUrl,
        inlineLogos: inlineScan.then((result) => result.logos),
        outDir: args.outDir,
      });
      const inline = await inlineScan;
      payload.skipped.push(...inline.skipped.map((row) => ({ url: "", ...row })));
      return payload;
    });
    completedPhases.push("logoAssets");
  } catch (error) {
    logoAssetsPayload = emptyLogoAssetsArtifact({
      status: "empty",
      error: error instanceof Error ? error.message : String(error),
    });
    completedPhases.push("logoAssets-degraded");
  }
  await writeJson(logoAssetsPayload, artifactPaths.logoAssets, args.pretty);

  // One overlay controller for the page, shared by the two hover probes: a
  // popup that opens after settle covers the product grid and the buttons
  // alike, and an interceptor is attempted once for the whole pass.
  const overlay = createPageOverlayController(page);
  const { rows: productCardPayload, recoverySummary } = await timePhase("productCardStyles", () =>
    collectProductCardStyles(
      page,
      {
        ...args,
        selectors: productCardSelectors,
        priceSelectors,
        oldPriceSelectors,
        ctaSelectors,
      },
      {
        capturePayload,
        capturePath: artifactPaths.capture,
        overlay,
      },
    ));
  await writeJson(productCardPayload, artifactPaths.productCards, args.pretty);
  completedPhases.push("productCardStyles");
  await writeJson(recoverySummary, artifactPaths.productCardRecovery, args.pretty);

  // Demo product-data harvest. Runs right after the product-card probe and
  // BEFORE buttonStyles (which can take 100s+ — product data must not sit
  // behind it). Degrades like buttonStyles: the artifact is ALWAYS written,
  // empty on failure, and is never listed as required for assembly.
  let productDataPayload;
  try {
    productDataPayload = await timePhase("productData", () =>
      collectProductData(page, { probeRows: productCardPayload, recoverySummary }));
    completedPhases.push("productData");
  } catch (error) {
    productDataPayload = emptyProductDataArtifact({
      pageUrl: page.url(),
      status: "empty",
      error: error instanceof Error ? error.message : String(error),
    });
    completedPhases.push("productData-degraded");
  }
  await writeJson(productDataPayload, artifactPaths.productData, args.pretty);
  const productDataSummary = {
    written: true,
    count: Array.isArray(productDataPayload?.products) ? productDataPayload.products.length : 0,
    status: productDataPayload?.status || "empty",
  };

  const languageSelectors = [
    ...args.languageSelectors.filter(Boolean),
    ...((pageSignalsPayload?.languageContainerSelectors || []).filter(Boolean)),
  ].filter((value, index, items) => items.indexOf(value) === index);
  const shouldCollectLanguage =
    Array.isArray(pageSignalsPayload?.visibleLanguageHints) &&
    pageSignalsPayload.visibleLanguageHints.length >= 2 &&
    languageSelectors.length > 0;
  if (shouldCollectLanguage) {
      const languagePayload = await timePhase("languageSubtree", () => collectLanguageSubtree(page, languageSelectors));
      if (Array.isArray(languagePayload?.matches) && languagePayload.matches.length > 0) {
        await writeJson(languagePayload, artifactPaths.language, args.pretty);
      completedPhases.push("languageSubtree");
    }
  }

  let buttonPayload = [];
  let buttonProbeError = "";
  const buttonDiagnostics = createButtonProbeDiagnostics();
  try {
    buttonPayload = await timePhase("buttonStyles", () =>
      collectButtonStyles(page, buttonSelectors, { diagnostics: buttonDiagnostics, overlay }));
    completedPhases.push("buttonStyles");
  } catch (error) {
    buttonPayload = [];
    buttonProbeError = error instanceof Error ? error.message : String(error);
    completedPhases.push("buttonStyles-degraded");
  }
  await writeJson(buttonPayload, artifactPaths.buttons, args.pretty);
  // Best-effort, and after the artifact the pipeline actually consumes: a
  // diagnostics sidecar must never be able to fail a pass that produced its
  // required evidence. On a degraded probe the recorder still holds the rows
  // it managed to reach, which is exactly when the sidecar is most useful.
  try {
    await writeJson(buttonDiagnostics.toJSON(), artifactPaths.buttonDiagnostics, args.pretty);
  } catch {}

  await writeHomepagePassStatus({
    status: "completed",
    pageUrl: page.url(),
    shouldCollectLanguage,
    pageSignalsPayload,
    recoverySummary,
    buttonProbeDegraded: Boolean(buttonProbeError),
    buttonProbeError,
    overlaySummary: overlay.summary(),
    productDataSummary,
  });
  completedPhases.push("status");

  await writeJson(
    {
      url: page.url(),
      artifacts: artifactPaths,
      languageCollected: shouldCollectLanguage,
      pageSignalsSummary: {
        visibleLanguageHintCount: Array.isArray(pageSignalsPayload?.visibleLanguageHints)
          ? pageSignalsPayload.visibleLanguageHints.length
          : 0,
        socialCount: Array.isArray(pageSignalsPayload?.socials) ? pageSignalsPayload.socials.length : 0,
        importantLinkCount: Array.isArray(pageSignalsPayload?.importantLinks)
          ? pageSignalsPayload.importantLinks.length
          : 0,
      },
      productCardRecovery: {
        finalPhase: recoverySummary?.finalPhase || "initial",
        failureSignals: Array.isArray(recoverySummary?.failureSignals) ? recoverySummary.failureSignals : [],
      },
      statusPath: artifactPaths.status,
    },
    "",
    args.pretty,
  );
  }
} catch (error) {
  await writeHomepagePassStatus({
    status: "failed",
    pageUrl: page?.url?.() || lastKnownPageUrl,
    buttonProbeDegraded: false,
    buttonProbeError: "",
    errorMessage: error instanceof Error ? error.message : String(error),
  }).catch(() => {});
  throw error;
} finally {
  await browser?.close?.().catch(() => {});
  await Promise.all(
    Object.values(temporaryScreenshotPaths).map((temporaryPath) =>
      unlink(temporaryPath).catch(() => {})),
  );
}
