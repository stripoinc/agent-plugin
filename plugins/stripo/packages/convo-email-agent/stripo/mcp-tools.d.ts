import type { McpAdapterToolMapping } from "../mcp-tools.js";
export type StripoSupportedMcpOperation = "getEmailModel" | "getEmailModelSchema" | "getEmailMessagePreview" | "createEmailShell" | "prepareEmailModelUpload" | "updateEmailModel";
/** Available Stripo operations; unsupported capabilities must never be guessed. */
export interface StripoMcpToolMapping extends McpAdapterToolMapping<"stripo", StripoSupportedMcpOperation> {
    readonly auxiliaryTools: Readonly<Record<"identity" | "contentMetadata" | "recoverCreatedEmail" | "folders", string>>;
    readonly entityTypes: readonly ["EMAIL", "TEMPLATE"];
    readonly contract: Readonly<Record<"read" | "prepare" | "write" | "preview", Readonly<Record<string, string | boolean>>>>;
}
export declare const STRIPO_MCP_TOOL_MAPPING: StripoMcpToolMapping;
