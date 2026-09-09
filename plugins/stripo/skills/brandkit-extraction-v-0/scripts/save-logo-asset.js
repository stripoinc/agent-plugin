#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { ProxyAgent } from "undici";

import { rethrowAsBrowserProxyRefusal, defaultBrowserProxyUrl } from "./lib/browser-proxy-refusal.js";
// THE proxy-URL parser (see its header): shared with lib.js and the Browserbase
// connector so the three clients cannot drift apart again. Only the output
// SHAPE is local — undici's ProxyAgent takes `{uri, token}`.
import { parseProxyUrl } from "./lib/browser-proxy-connect-probe.js";

// The publisher runtime has no direct egress: every asset fetch must
// tunnel through the thread's approved browser proxy. Mirrors the
// contract of download_website_via_browser_proxy.sh.
function buildProxyDispatcher() {
  const proxyUrl = defaultBrowserProxyUrl();
  if (!proxyUrl) {
    // Unreachable in publisher-runtime — the proxy URL is minted for every
    // turn whether or not website_access was approved, so an unapproved
    // thread lands on the CONNECT refusal in main() instead of here. Kept
    // for local dev and for any caller that strips the env var.
    throw new Error(
      "PUBLISHER_BROWSER_PROXY_URL is not set. Website access has not been approved for this thread yet — request the website_access permission first, then retry.",
    );
  }
  const parsed = parseProxyUrl(proxyUrl);
  if (!parsed) {
    throw new Error(
      `PUBLISHER_BROWSER_PROXY_URL is not a usable http(s) proxy URL: ${proxyUrl}`,
    );
  }
  const options = { uri: `${parsed.protocol}//${parsed.host}` };
  // Left unset (not set to "") when the URL carries no credentials — undici
  // treats a present `token` as an authorization header to send.
  if (parsed.authorization) {
    options.token = parsed.authorization;
  }
  return new ProxyAgent(options);
}

function parseArgs(argv) {
  const args = {
    assetUrl: null,
    outDir: null,
    basename: "logo",
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--asset-url") {
      args.assetUrl = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (token === "--out-dir") {
      args.outDir = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (token === "--basename") {
      args.basename = argv[index + 1] ?? "logo";
      index += 1;
      continue;
    }
    if (token === "--pretty") {
      args.pretty = true;
    }
  }

  if (!args.assetUrl) throw new Error("Missing required flag: --asset-url <url>");
  if (!args.outDir) throw new Error("Missing required flag: --out-dir <path>");
  return args;
}

function safeName(value) {
  return String(value || "logo").replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "") || "logo";
}

function validateAssetUrl(assetUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(assetUrl);
  } catch (error) {
    throw new Error(`Invalid asset URL: ${error.message}`);
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error(`Asset URL must use http or https: ${assetUrl}`);
  }

  if (parsedUrl.username || parsedUrl.password) {
    throw new Error(`Asset URL must not contain credentials: ${assetUrl}`);
  }

  return parsedUrl;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const assetUrl = validateAssetUrl(args.assetUrl);
  const dispatcher = buildProxyDispatcher();
  let response;
  try {
    response = await fetch(assetUrl, { redirect: "follow", dispatcher });
  } catch (error) {
    // Transport failure only. undici buries the proxy's CONNECT status two
    // `cause` levels below a bare "fetch failed" — but it DOES preserve the
    // status, so the shared classifier branches on the real 403/407/405/502/504
    // here without needing its Chromium-side probe.
    await rethrowAsBrowserProxyRefusal(error, {
      targetUrl: assetUrl.toString(),
      browserProxyConfigured: defaultBrowserProxyUrl() !== "",
      proxyUrl: defaultBrowserProxyUrl(),
    });
  }
  if (!response.ok) {
    // Deliberately NOT routed through the refusal translation: this response
    // came back THROUGH the tunnel, so the status belongs to the target site
    // (a hotlink-protected asset 403s here) and is not an approval problem.
    throw new Error(`Failed to fetch asset: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const finalUrl = validateAssetUrl(response.url || assetUrl.toString());
  const urlExt = path.extname(finalUrl.pathname).toLowerCase();
  const ext = contentType.includes("image/svg+xml") || urlExt === ".svg"
    ? ".svg"
    : urlExt || ".bin";

  const outDir = path.resolve(args.outDir);
  await fs.mkdir(outDir, { recursive: true });

  const filename = `${safeName(args.basename)}${ext}`;
  const absolutePath = path.join(outDir, filename);
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(absolutePath, buffer);

  const result = {
    assetUrl: finalUrl.toString(),
    contentType,
    saved: true,
    localPath: absolutePath,
    isSvg: ext === ".svg",
  };

  process.stdout.write(`${JSON.stringify(result, null, args.pretty ? 2 : 0)}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
