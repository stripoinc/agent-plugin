// src/reteno/mcp-tools.ts
var RETENO_MCP_TOOL_MAPPING = Object.freeze({
  brand: "reteno",
  canonicalBrand: "reteno",
  fieldMapping: "identity",
  tools: Object.freeze({
    getBrandkit: "get_brandkit",
    prepareBrandkitUpload: "prepare_brandkit_upload",
    updateBrandkitFromExtraction: "update_brandkit_from_extraction",
    updateBrandkit: "update_brandkit",
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
    // Stripo calls the Brand Kit a Business Profile and scopes it to a project, where Reteno's is
    // account-wide: every brandkit call needs a projectId the adapter resolves through find_projects.
    getBrandkit: "get_business_profile",
    prepareBrandkitUpload: "prepare_business_profile_upload",
    // One tool covers both replacements; the adapter supplies website only for extracted data.
    updateBrandkitFromExtraction: "replace_business_profile",
    updateBrandkit: "replace_business_profile",
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
    folders: "find_folders",
    // Resolves the projectId the Business Profile tools require.
    projects: "find_projects",
    // No canonical counterpart: Reteno has no partial Brand Kit write.
    patchBrandkit: "patch_business_profile"
  }),
  unsupported: Object.freeze({
    listEmailInterfaces: "This editor has no sending interfaces.",
    updateEmailMetadata: "No write tool for name, project, or folder metadata. Native document title/preheader use updateEmailModel.",
    prepareImageUpload: "Reuse hosted reference assets or user-supplied hosted assets.",
    uploadImage: "No asset upload tool is available.",
    createTemplate: "Templates can be read, edited and rebuilt; only emails can be created."
  })
});

// src/mcp-tools.ts
var CANONICAL_MCP_OPERATIONS = [
  "getBrandkit",
  "prepareBrandkitUpload",
  "updateBrandkitFromExtraction",
  "updateBrandkit",
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
  const mapping = brand === "yespo" ? RETENO_MCP_TOOL_MAPPING : getMcpToolMapping(brand);
  return Object.keys(mapping.tools);
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
