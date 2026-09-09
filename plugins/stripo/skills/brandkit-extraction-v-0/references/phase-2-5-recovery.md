<!-- Moved out of SKILL.md by the 0.3.0 contract split. The text below is
     verbatim from SKILL.md at sha256 6cdd8d5975fa8aca548fbe00d5507260bf6d5ec6522d61ddaa0e4fa512ef9609. -->

# Phase 2.5 — bounded styling-role recovery

Read this only when the packet lists an `unresolvedRoles` entry you intend
to act on and the screenshot/DOM identifies a concrete semantic element.

Phase 2.5 — bounded styling-role recovery (only for a concrete unresolved styling role): inspect this run's `home.png` together with `dom.json` / page context, identify the exact semantic element, and write `${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/agent-role-recovery.request.json` with `version: 1` and one `recoveries[]` entry containing the role, CSS `locator.selector`, visible-element `locator.matchIndex`, optional exact `expectedText`, and the property to measure. Run only the packaged probe:

```bash
node ${BRANDKIT_SKILL_ROOT}/scripts/recover-role-styles.js \
  --technical-dir ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example \
  --request ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/agent-role-recovery.request.json \
  --pretty
```

The runner writes `agent-role-recovery.json`, bound by SHA-256 to this run's `capture.json`, `home.png`, and `text-styles.json` when that capture exists. A `status: "reprobed"` row contains the exact computed style and is the only route to `agent-recovered`; for an existing carrier, copy that measured value exactly into the targeted row before normalize, while an absent role is filled automatically by normalize. Do not round, adjust, or transfer the value to a different role.

The runner always attempts the exact locator first. A fallback may be declared as a contingency in that first request, but it is copied into the output only after `status: "reprobe-failed"` with `failure.code` equal to `element-missing`, `element-hidden`, or `probe-error`; alternatively, add it in a second request after seeing that eligible failure and rerun once. `kind: "screenshot-color"` must name a canonical hex plus a region wholly inside this run's `home.png`; the runner decodes that PNG and rejects the fallback unless the named colour occurs in the declared pixels (allowing only a small antialiasing tolerance). An accepted value becomes `screenshot-sampled` and warns. Typography is never read from pixels: `kind: "typography-default"` must either copy a complete tuple from one exact same-run `text-styles.json` row named by `{kind: "captured-row", selector, matchIndex}`, or use `{kind: "system-default"}` only when no suitable row exists. For `system-default`, omit `fallback.value`; the runner injects the supported role's fixed conservative tuple and rejects unsupported roles. Both typography forms are `defaulted`, never measured, and warn. `selector-invalid` and `text-mismatch` do not authorize any fallback: repair the request instead. Never invent a font, URL, role grade, or screenshot value outside this bounded artifact. The closed request shape is `references/agent-role-recovery.request.schema.json`; the full output shape is `references/agent-role-recovery.schema.json`.

## The bounded pass itself

Added 2026-09-07, when the trigger for this file moved into the contract and the
procedure moved here: the contract states WHEN to recover, this file states HOW.

Group the exact DOM targets into the existing re-probe call(s) — one call
carrying several targets, not one call per target — and allow at most one
targeted retry per target. Use a screenshot colour, or a labelled typography
fallback, only under the preconditions stated above and in the role contract.
Do not keep browsing to fill optional gaps: a role with no concrete visible
target is a gap to report, not a target to hunt.
