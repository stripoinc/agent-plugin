export declare const RETENO_MCP_TOOL_MAPPING: Readonly<{
    brand: "reteno";
    canonicalBrand: "reteno";
    fieldMapping: "identity";
    tools: Readonly<{
        getBrandkit: "get_business_profile";
        prepareBrandkitUpload: "prepare_business_profile_upload";
        updateBrandkitFromExtraction: "save_business_profile";
        updateBrandkit: "save_business_profile";
        listEmailInterfaces: "list_email_interfaces";
        getEmailModel: "get_email_model";
        getEmailModelSchema: "get_email_model_schema";
        getEmailMessageExport: "get_email_message_export";
        listCustomBlocks: "list_custom_blocks";
        getEmailMessagePreview: "get_email_message_preview_png";
        getEmailMessageViewLink: "get_email_message_view_link";
        createEmailShell: "create_email_shell";
        prepareEmailModelUpload: "prepare_email_model_upload";
        updateEmailModel: "update_email_model";
        updateEmailMetadata: "update_email_metadata";
        prepareImageUpload: "prepare_image_upload";
        uploadImage: "upload_image";
    }>;
    auxiliaryTools: Readonly<{
        patchBrandkit: "patch_business_profile";
    }>;
}>;
