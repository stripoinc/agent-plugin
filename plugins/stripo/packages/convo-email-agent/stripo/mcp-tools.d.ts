/** Available Stripo operations; unsupported capabilities must never be guessed. */
export declare const STRIPO_MCP_TOOL_MAPPING: Readonly<{
    brand: "stripo";
    canonicalBrand: "reteno";
    fieldMapping: "adapter";
    tools: Readonly<{
        getBrandkit: "get_business_profile";
        prepareBrandkitUpload: "prepare_business_profile_upload";
        updateBrandkitFromExtraction: "replace_business_profile";
        updateBrandkit: "replace_business_profile";
        getEmailModel: "get_document_state";
        getEmailModelSchema: "get_document_state_schema";
        getEmailMessagePreview: "get_screenshot";
        createEmailShell: "create_email";
        prepareEmailModelUpload: "prepare_document_state_upload";
        updateEmailModel: "set_document_state";
    }>;
    auxiliaryTools: Readonly<{
        identity: "whoami";
        contentMetadata: "get_content";
        recoverCreatedEmail: "find_content";
        folders: "find_folders";
        projects: "find_projects";
        patchBrandkit: "patch_business_profile";
        generateImage: "generate_image";
        editImage: "edit_image";
        getImageJob: "get_image_job";
    }>;
    unsupported: Readonly<{
        getEmailMessageExport: "No compiled email export tool is available. Read native metadata with getEmailModel.";
        getEmailMessageViewLink: "No hosted email-view link operation is available in this adapter.";
        listCustomBlocks: "No saved-module library tool is available in this adapter.";
        listEmailInterfaces: "This editor has no sending interfaces.";
        updateEmailMetadata: "No write tool for name, project, or folder metadata. Native document title/preheader use updateEmailModel.";
        prepareImageUpload: "No local asset upload tool. Reuse hosted assets or a completed Stripo image job's URL.";
        uploadImage: "No local asset upload tool. Stripo image jobs host their own results.";
        createTemplate: "Templates can be read, edited and rebuilt; only emails can be created.";
    }>;
}>;
