import value0 from './support-1.js';
import value1 from './support-15.js';
export default {
["editorRevision"]: "1e786dd4e00a6614b2ace4d88a1df5c68a682d9e",
["sourcesSha256"]: "4635c006044f7fa13b43d2d553659b51b4974b0dacb13d7919bc726cc7e99963",
["review"]: "Editor releases/2.114 review for 1e786dd4 (2026-10-22), on top of the reviewed develop 2a78eba9 and including the 2.112/2.113 release merges. The Document State input schema, generated types, block union, roots, node and field capabilities and native defaults are unchanged byte for byte; every field keeps its previous decision. Validation rules are unchanged: the source changes reachable from the validator only move the font modules into block-operations-api/common/fonts (font-utils, font-value-rules) and move the merge-service schema adapter, with its unavailable side-effect rules intact, to ui-editor-ui/node-utils/copilot-document-state/copilot-schema.ts. Set behavior: video size keeps an explicitly requested non-responsive state when a preceding move enabled responsiveness; preview regeneration keeps the block's existing animated play button (ED-9540; no Document State field). Merge-service now enables the Go NodesAPI by default (NATIVE_CORE_ENABLED=true) and runs Blocks API patch plugins only behind BLOCKS_PATCH_PLUGINS_ENABLED (default false, ED-9668); MergeExportLibrary.create defaults the same flag to false. Blocks API: videoBlock isPlayButtonAnimated (read) and animatePlayButton in the host preview effect config; NodesAPI arguments gained installPatchPlugins, businessOperations, processPatchAndComplete, getCompletedPatch (read) and waitForQueuedCommands, which moved first-traversal references of 116 entries and of the textBlock/structure argument subtrees (1,824 relocated, 2,572 new locations). New API traversal locations inherit the nearest reviewed ancestor; new methods follow the read/mutation naming of the facade; MergeExportLibrary members are host.",
["roots"]: [
  "metadata",
  "resources",
  "settings",
  "stripes"
],
["blocks"]: [
  "text",
  "image",
  "video",
  "timer",
  "social",
  "html",
  "button",
  "spacer",
  "menu",
  "unknown"
],
["groups"]: {
  "shape": {
    "decision": "structure",
    "method": "native factories / insert / append / move / remove",
    "omission": "Preserve existing identities; deletion needs removeNodes intent.",
    "source": "ui-editor-ui/src/app/services/api/editor-copilot-api/schema/email-template.schema.ts",
    "scenario": "test/documentStateContract.test.ts"
  },
  "patch": {
    "decision": "patch",
    "method": "patchSettings",
    "omission": "Omitted patch fields are retained. Full target omission needs a reviewed reset.",
    "source": "ui-editor-ui/src/app/services/api/editor-copilot-api/parser/json-schema-parser.ts",
    "scenario": "test/fieldCoverage.test.ts"
  },
  "readonly": {
    "decision": "read-only",
    "method": "inspect",
    "omission": "Retain verbatim; changes need a host operation.",
    "source": "ui-editor-ui/src/app/services/api/editor-copilot-api/exporter/types/index.ts",
    "scenario": "test/documentStateContract.test.ts"
  },
  "metadata": {
    "decision": "method",
    "method": "setMetadata",
    "omission": "Omitted title/preheader inherit current; explicit empty text clears.",
    "source": "ui-editor-ui/src/app/services/api/editor-copilot-api/runtime/copilot-schema-runtime.ts",
    "scenario": "test/emailMetadata.test.ts"
  },
  "fonts": {
    "decision": "atomic-replacement",
    "method": "setFonts / insertFrom",
    "omission": "No implicit loss; full replacement requires resources/fonts intent.",
    "source": "ui-editor-ui/src/app/services/api/editor-copilot-api/exporter/json-schema-exporter.ts",
    "scenario": "test/documentStateContract.test.ts"
  },
  "social": {
    "decision": "collection-method",
    "method": "addSocialNetwork / setSocialNetwork / removeSocialNetwork / moveSocialNetwork",
    "omission": "Atomic networks replacement; shared textCustomization changes alt fields together.",
    "source": "ui-editor-ui/src/app/services/api/editor-copilot-api/exporter/types/index.ts",
    "scenario": "test/socialBlocks.test.ts"
  },
  "menu": {
    "decision": "collection-method",
    "method": "addMenuItem / updateMenuItem / removeMenuItem / moveMenuItem / setMenuMode",
    "omission": "Atomic items or discriminated color/item-type replacement.",
    "source": "ui-editor-ui/src/app/services/api/editor-copilot-api/exporter/types/menu-block.ts",
    "scenario": "test/editorRuntime.test.ts"
  },
  "content": {
    "decision": "method",
    "method": "setText / setHtml / setExtension",
    "omission": "Full explicit value; extension is a native boolean on unknown.",
    "source": "ui-editor-ui/src/app/services/api/editor-copilot-api/parser/json-schema-parser.ts",
    "scenario": "test/editorRuntime.test.ts"
  },
  "effects": {
    "decision": "contextual-patch",
    "method": "patchSettings; validateChange checks the actual preview dependency",
    "omission": "Changing a preview input is refused when its effect is unavailable; unrelated settings remain editable.",
    "source": "ui-editor-ui/node-utils/copilot-document-state/copilot-schema.ts",
    "scenario": "test/documentStateContract.test.ts"
  },
  "apiRead": {
    "decision": "read",
    "method": "inspect / describe / getCapabilities",
    "omission": "Queries never mutate Document State.",
    "source": "ui-editor-ui/src/app/core/block-operations-api/facade/interfaces.ts",
    "scenario": "test/documentStateContract.test.ts"
  },
  "apiMutation": {
    "decision": "document-state-operation",
    "method": "typed patchSettings / content / layout / collection methods",
    "omission": "Command arguments map to the native field shape; command execution belongs to ordinary set.",
    "source": "ui-editor-ui/src/app/core/block-operations-api/facade/interfaces.ts",
    "scenario": "test/fieldCoverage.test.ts"
  },
  "host": {
    "decision": "host",
    "method": "upload / set / get / importDocumentSnapshot / prepareDocumentState",
    "omission": "IPC lifecycle, CRDT patches, browser effects and gallery persistence have no direct JSON setter.",
    "source": "ui-editor-ui/src/app/core/block-operations-api/facade/interfaces.ts",
    "scenario": "test/editorRuntime.test.ts"
  }
},
["fields"]: value0,
["api"]: value1
};
