import value0 from './support-1.js';
import value1 from './support-15.js';
export default {
["editorRevision"]: "9fe0771bd1219868d7053ef7e323dc3406329de3",
["sourcesSha256"]: "1e9a3c460274bf5181fccb76a0509a5a0c076c60abcad067f55c188af0a3e454",
["review"]: "Editor releases/2.111 review for 9fe0771b. Semantic changes: line Spacer settings.mobileBorder ({size, style, color} or null; null inherits the desktop border, omission preserves an override, space mode rejects it) is a patchSettings field and a reviewed spacer reset; headings h1-h6 fontSize and lineHeight (desktop and mobile) and textAlign.mobile are nullable resets; set requires baseSubDomainSourcePath for Social targets (host environment) and repairs relative standard icon sources (host). Other changed hashes are $ref renumbering of the schema factory and strictNullChecks type printing; they keep their previous decisions. New API traversal locations inherit the nearest reviewed ancestor; new methods follow the read/mutation naming of the facade.",
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
    "source": "ui-editor-ui/src/app/core/nodes-api/external-merge-service/ipc/operations/copilot-schema.ts",
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
