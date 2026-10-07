// convo-email-agent/src/reteno/mcp-tools.ts
var RETENO_MCP_TOOL_MAPPING = Object.freeze({
  brand: "reteno",
  canonicalBrand: "reteno",
  fieldMapping: "identity",
  tools: Object.freeze({
    getBrandkit: "get_business_profile",
    prepareBrandkitUpload: "prepare_business_profile_upload",
    updateBrandkitFromExtraction: "save_business_profile",
    updateBrandkit: "save_business_profile",
    listEmailInterfaces: "list_email_interfaces",
    getEmailModel: "get_email_model",
    getEmailModelSchema: "get_email_model_schema",
    getEmailMessageExport: "get_email_message_export",
    listCustomBlocks: "list_custom_blocks",
    getEmailMessagePreview: "get_email_message_preview_png",
    getEmailMessageViewLink: "get_email_message_view_link",
    createEmailShell: "create_email_shell",
    prepareEmailModelUpload: "prepare_email_model_upload",
    updateEmailModel: "update_email_model",
    updateEmailMetadata: "update_email_metadata",
    prepareImageUpload: "prepare_image_upload",
    uploadImage: "upload_image"
  }),
  auxiliaryTools: Object.freeze({
    // Supported inline field edits remain separate from the staged full-profile workflows.
    patchBrandkit: "patch_business_profile"
  })
});

// convo-email-agent/src/stripo/mcp-tools.ts
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
    updateEmailModel: "set_document_state",
    prepareImageUpload: "prepare_image_upload",
    uploadImage: "upload_image"
  }),
  auxiliaryTools: Object.freeze({
    identity: "whoami",
    contentMetadata: "get_content",
    recoverCreatedEmail: "find_content",
    folders: "find_folders",
    // Resolves the projectId the Business Profile tools require.
    projects: "find_projects",
    // Supported-field updates are auxiliary operations in both provider mappings.
    patchBrandkit: "patch_business_profile",
    // Stripo hosts completed image jobs in the target letter's gallery.
    generateImage: "generate_image",
    editImage: "edit_image",
    getImageJob: "get_image_job"
  }),
  unsupported: Object.freeze({
    getEmailMessageExport: "No compiled email export tool is available. Read native metadata with getEmailModel.",
    getEmailMessageViewLink: "No hosted email-view link operation is available in this adapter.",
    listCustomBlocks: "No saved-module library tool is available in this adapter.",
    listEmailInterfaces: "This editor has no sending interfaces.",
    updateEmailMetadata: "No write tool for name, project, or folder metadata. Native document title/preheader use updateEmailModel.",
    createTemplate: "Templates can be read, edited and rebuilt; only emails can be created."
  })
});

// convo-email-agent/src/mcp-tools.ts
var CANONICAL_MCP_OPERATIONS = [
  "getBrandkit",
  "prepareBrandkitUpload",
  "updateBrandkitFromExtraction",
  "updateBrandkit",
  "listEmailInterfaces",
  "getEmailModel",
  "getEmailModelSchema",
  "getEmailMessageExport",
  "listCustomBlocks",
  "getEmailMessagePreview",
  "getEmailMessageViewLink",
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
  RETENO_MCP_TOOL_MAPPING,
  STRIPO_MCP_TOOL_MAPPING,
  CANONICAL_MCP_OPERATIONS,
  EMAIL_INTERFACE_MCP_BRANDS,
  supportsEmailInterfaces,
  getMcpOperationsForBrand,
  getMcpToolMapping
};
