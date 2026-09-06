import { type StripoMcpToolMapping } from "./stripo/mcp-tools.js";
export { RETENO_MCP_TOOL_MAPPING } from "./reteno/mcp-tools.js";
export { STRIPO_MCP_TOOL_MAPPING, type StripoMcpToolMapping, type StripoSupportedMcpOperation } from "./stripo/mcp-tools.js";
/**
 * Semantic MCP operation catalog used by the email skills.
 *
 * Reteno names are canonical, but not every operation applies to every brand.
 * A brand adapter must provide a complete entry for its applicable operations
 * and translate non-identity fields at the adapter boundary; skills must not
 * guess brand-specific names at runtime.
 */
export declare const CANONICAL_MCP_OPERATIONS: readonly ["getBrandkit", "listEmailInterfaces", "getEmailModel", "getEmailModelSchema", "getEmailMessagePreview", "createEmailShell", "prepareEmailModelUpload", "updateEmailModel", "updateEmailMetadata", "prepareImageUpload", "uploadImage"];
export type CanonicalMcpOperation = (typeof CANONICAL_MCP_OPERATIONS)[number];
export type McpBrand = "reteno" | "yespo" | "stripo";
export declare const EMAIL_INTERFACE_MCP_BRANDS: readonly ["reteno", "yespo"];
export type EmailInterfaceMcpBrand = (typeof EMAIL_INTERFACE_MCP_BRANDS)[number];
export type McpOperationForBrand<TBrand extends McpBrand> = Exclude<CanonicalMcpOperation, "listEmailInterfaces"> | (TBrand extends EmailInterfaceMcpBrand ? "listEmailInterfaces" : never);
export interface McpToolMapping<TBrand extends McpBrand = "reteno"> {
    readonly brand: TBrand;
    readonly canonicalBrand: "reteno";
    readonly fieldMapping: TBrand extends "reteno" ? "identity" : "adapter";
    readonly tools: Readonly<Record<McpOperationForBrand<TBrand>, string>>;
}
/**
 * Mapping for a brand whose MCP exposes only some canonical operations. Every
 * canonical operation is either mapped in `tools` or explained in `unsupported`,
 * which may also record brand-specific limitations under their own keys.
 */
export interface McpAdapterToolMapping<TBrand extends McpBrand, TSupported extends CanonicalMcpOperation> {
    readonly brand: TBrand;
    readonly canonicalBrand: "reteno";
    readonly fieldMapping: "adapter";
    readonly tools: Readonly<Record<TSupported, string>>;
    readonly unsupported: Readonly<Record<Exclude<CanonicalMcpOperation, TSupported>, string>> & Readonly<Record<string, string>>;
}
export declare function supportsEmailInterfaces(brand: McpBrand): brand is EmailInterfaceMcpBrand;
export declare function getMcpOperationsForBrand<TBrand extends McpBrand>(brand: TBrand): readonly McpOperationForBrand<TBrand>[];
export declare function getMcpToolMapping(brand: "reteno"): McpToolMapping<"reteno">;
export declare function getMcpToolMapping(brand: "stripo"): StripoMcpToolMapping;
export declare function getMcpToolMapping(brand: "reteno" | "stripo"): McpToolMapping<"reteno"> | StripoMcpToolMapping;
