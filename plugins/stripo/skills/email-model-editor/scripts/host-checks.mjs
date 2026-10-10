// src/skill-scripts/stripo/host-checks.ts
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync as existsSync2, realpathSync as realpathSync2 } from "node:fs";
import path3 from "node:path";
import { pathToFileURL as pathToFileURL2 } from "node:url";

// src/skill-scripts/shared/runtime.ts
import { existsSync, mkdirSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function compactError(error) {
  const fields = error instanceof Error || isObject(error) ? error : void 0;
  const errors = fields && "errors" in fields && Array.isArray(fields.errors) ? fields.errors : void 0;
  return {
    name: typeof fields?.name === "string" ? fields.name : "Error",
    message: String(fields?.message ?? error).slice(0, 2e3),
    ...errors ? { errors } : {},
    ...Object.fromEntries(["code", "stage", "input", "path", "issues"].flatMap((key) => fields && key in fields ? [[key, fields[key]]] : []))
  };
}
function resolveSdkDist(startUrl = import.meta.url) {
  const override = process.env.CONVO_EMAIL_AGENT_SDK_PATH;
  let candidate;
  if (override) {
    candidate = path.resolve(override);
  } else {
    const scriptDirectory = path.dirname(fileURLToPath(startUrl));
    const parent = path.dirname(scriptDirectory);
    if (path.basename(scriptDirectory) === "scripts" && path.basename(path.dirname(parent)) === "skills") {
      candidate = path.resolve(scriptDirectory, "../../../packages/convo-email-agent/index.js");
    } else if (path.basename(parent) === "skill-scripts" && path.basename(path.dirname(parent)) === ".build") {
      candidate = path.resolve(scriptDirectory, "../../sdk/index.js");
    }
  }
  if (candidate && existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  throw new Error(
    `Cannot find the packaged convo-email-agent SDK${candidate ? ` at ${candidate}` : ""}. Install skills/ and packages/ together or set CONVO_EMAIL_AGENT_SDK_PATH to an existing index.js.`
  );
}
async function loadSdk(sdkPath) {
  return import(pathToFileURL(sdkPath).href);
}

// src/skill-scripts/shared/document-files.ts
import { readFile } from "node:fs/promises";
import path2 from "node:path";
async function validateDocumentFiles(input) {
  try {
    if (!input || !["create", "edit"].includes(input.mode) || (input.mode === "edit" ? !input.baseFile : input.baseFile !== void 0)) {
      throw new Error("Edit validation requires the untouched base; creation must not supply a base.");
    }
    for (const file of [input.candidateFile, input.baseFile].filter((value) => value !== void 0)) {
      if (typeof file !== "string" || !path2.isAbsolute(file)) throw new Error("Candidate/base paths must be absolute.");
    }
    const sdk = await loadSdk(resolveSdkDist());
    const target = JSON.parse(await readFile(input.candidateFile, "utf8"));
    const current = input.baseFile ? JSON.parse(await readFile(input.baseFile, "utf8")) : void 0;
    const validation = sdk.validateChange({ target, current, intent: input.intent });
    return validation.success ? { valid: true } : { valid: false, errors: validation.issues };
  } catch (error) {
    return { valid: false, errors: compactError(error) };
  }
}

// src/skill-scripts/stripo/hosted-image-url.ts
function isHostedImageUrl(value, uploadUrl) {
  try {
    if (typeof value !== "string") return false;
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && url.href !== uploadUrl && ![...url.searchParams.keys()].some((key) => /^x-(amz|goog)-/iu.test(key));
  } catch {
    return false;
  }
}

// src/skill-scripts/stripo/host-checks.ts
async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[0] !== "--request" || args[1] !== "-" || args[2] !== "--result" || !path3.isAbsolute(args[3])) {
    throw new Error("Use --request - --result <absolute report.json>.");
  }
  let source = "";
  for await (const chunk of process.stdin) {
    source += chunk.toString();
    if (Buffer.byteLength(source) > 1024 * 1024) throw new Error("Validation request exceeds 1 MiB.");
  }
  const input = JSON.parse(source);
  if (!isObject(input) || !["document", "image-url"].includes(String(input.kind))) throw new Error("Expected a document or image-url check.");
  const report = input.kind === "image-url" ? { valid: isHostedImageUrl(input.url, input.uploadUrl) } : await validateDocumentFiles(input);
  await mkdir(path3.dirname(args[3]), { recursive: true });
  await writeFile(args[3], `${JSON.stringify(report, null, 2)}
`, { flag: "wx", mode: 384 });
  console.log(JSON.stringify(report));
  if (!report.valid) process.exitCode = 1;
}
if (process.argv[1] && existsSync2(process.argv[1]) && import.meta.url === pathToFileURL2(realpathSync2(process.argv[1])).href) {
  main().catch((error) => {
    console.error(JSON.stringify({ valid: false, errors: compactError(error) }));
    process.exitCode = 1;
  });
}
