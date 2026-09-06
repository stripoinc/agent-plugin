// src/reteno/mcp-tools.ts
var RETENO_MCP_TOOL_MAPPING = Object.freeze({
  brand: "reteno",
  canonicalBrand: "reteno",
  fieldMapping: "identity",
  tools: Object.freeze({
    getBrandkit: "get_brandkit",
    listEmailInterfaces: "list_email_interfaces",
    getEmailModel: "get_email_model",
    getEmailModelSchema: "get_email_model_schema",
    getEmailMessagePreview: "get_email_message_preview_png",
    createEmailShell: "create_email_shell",
    prepareEmailModelUpload: "prepare_email_model_upload",
    updateEmailModel: "update_email_model",
    updateEmailMetadata: "update_email_metadata",
    prepareImageUpload: "prepare_image_upload",
    uploadImage: "upload_image"
  })
});

// src/stripo/mcp-tools.ts
var STRIPO_MCP_TOOL_MAPPING = Object.freeze({
  brand: "stripo",
  canonicalBrand: "reteno",
  fieldMapping: "adapter",
  tools: Object.freeze({
    getEmailModel: "get_document_state",
    getEmailModelSchema: "get_document_state_schema",
    getEmailMessagePreview: "get_screenshot",
    createEmailShell: "create_email",
    prepareEmailModelUpload: "prepare_document_state_upload",
    updateEmailModel: "set_document_state"
  }),
  auxiliaryTools: Object.freeze({
    identity: "whoami",
    contentMetadata: "get_content",
    recoverCreatedEmail: "find_content",
    folders: "find_folders"
  }),
  unsupported: Object.freeze({
    getBrandkit: "Use the reference email or template for brand facts.",
    listEmailInterfaces: "This editor has no sending interfaces.",
    updateEmailMetadata: "No metadata write tool is available.",
    prepareImageUpload: "Reuse hosted reference assets or user-supplied hosted assets.",
    uploadImage: "No asset upload tool is available.",
    createTemplate: "Templates can be read, edited and rebuilt; only emails can be created."
  }),
  entityTypes: ["EMAIL", "TEMPLATE"],
  contract: Object.freeze({
    read: { id: "id", type: "type", file: "downloadUrl" },
    prepare: { id: "id", type: "type", file: "uploadUrl", ticket: "uploadId" },
    write: { id: "id", type: "type", ticket: "uploadId", singleUse: true, baseVersion: false },
    preview: { id: "id", type: "type", mode: "BOTH", files: "screenshots" }
  })
});

// src/mcp-tools.ts
var CANONICAL_MCP_OPERATIONS = [
  "getBrandkit",
  "listEmailInterfaces",
  "getEmailModel",
  "getEmailModelSchema",
  "getEmailMessagePreview",
  "createEmailShell",
  "prepareEmailModelUpload",
  "updateEmailModel",
  "updateEmailMetadata",
  "prepareImageUpload",
  "uploadImage"
];
var EMAIL_INTERFACE_MCP_BRANDS = ["reteno", "yespo"];
function supportsEmailInterfaces(brand) {
  return brand === "reteno" || brand === "yespo";
}
function getMcpOperationsForBrand(brand) {
  return CANONICAL_MCP_OPERATIONS.filter(
    (operation) => operation !== "listEmailInterfaces" || supportsEmailInterfaces(brand)
  );
}
function getMcpToolMapping(brand) {
  if (brand === "reteno") return RETENO_MCP_TOOL_MAPPING;
  if (brand === "stripo") return STRIPO_MCP_TOOL_MAPPING;
  throw new Error(`Unsupported brand: ${String(brand)}`);
}
export {
  CANONICAL_MCP_OPERATIONS,
  EMAIL_INTERFACE_MCP_BRANDS,
  RETENO_MCP_TOOL_MAPPING,
  STRIPO_MCP_TOOL_MAPPING,
  getMcpOperationsForBrand,
  getMcpToolMapping,
  supportsEmailInterfaces
};
