import value0 from './support-1.js';
import value1 from './support-16.js';
export default {
["editorRevision"]: "46ab3a6821e8617a8c70f9778f2bb3e1a8b7d8e4",
["sourcesSha256"]: "9f92c476053f2b98790f82fa23ae628ef3790c4544f059320c94afe4ca4de1b6",
["review"]: "Editor releases/2.116 review for 46ab3a68 (2026-11-09), on top of the reviewed releases/2.114 1e786dd4. The live production get_document_state_schema equals this revision byte for byte. Input schema changes: optional darkTheme on stripe settings (stripeBackgroundColor, contentBackgroundColor, backgroundImage), structure and container settings (backgroundColor, backgroundImage); menu textStyle.underline; social settings became a two-branch union (custom networks require icon) instead of one object with a superRefine; dark-theme theme colours moved from nullable anyOf to type lists. 2,536 of the 2,611 changed field hashes are only renumbered schema references; the semantic changes are 75 ancestor or type changes, 554 added and 276 removed locations. New fields inherit the decision of the same path without the new union branch, else of the nearest ancestor (patch 362, social 192). New public API members inherit the host subtree, else are classified by method name (get/is/has read, update/set/... mutation), else by nearest ancestor; every new dark-theme method matches its light-theme analog; settings.getSnapshot and settings.normalize read, settings.prepare mutates.",
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
