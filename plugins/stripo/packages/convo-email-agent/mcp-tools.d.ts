import { RETENO_MCP_TOOL_MAPPING } from "./reteno/mcp-tools.js";
import { STRIPO_MCP_TOOL_MAPPING } from "./stripo/mcp-tools.js";
export { RETENO_MCP_TOOL_MAPPING } from "./reteno/mcp-tools.js";
export { STRIPO_MCP_TOOL_MAPPING } from "./stripo/mcp-tools.js";
/**
 * Semantic MCP operation catalog used by the email skills.
 *
 * Reteno names are canonical, but not every operation applies to every brand.
 * A brand adapter must provide a complete entry for its applicable operations
 * and translate non-identity fields at the adapter boundary; skills must not
 * guess brand-specific names at runtime.
 */
export declare const CANONICAL_MCP_OPERATIONS: readonly ["getBrandkit", "prepareBrandkitUpload", "updateBrandkitFromExtraction", "updateBrandkit", "listEmailInterfaces", "getEmailModel", "getEmailModelSchema", "getEmailMessagePreview", "createEmailShell", "prepareEmailModelUpload", "updateEmailModel", "updateEmailMetadata", "prepareImageUpload", "uploadImage"];
export type CanonicalMcpOperation = (typeof CANONICAL_MCP_OPERATIONS)[number];
export type McpBrand = "reteno" | "yespo" | "stripo";
export declare const EMAIL_INTERFACE_MCP_BRANDS: readonly ["reteno", "yespo"];
export type EmailInterfaceMcpBrand = (typeof EMAIL_INTERFACE_MCP_BRANDS)[number];
export type McpOperationForBrand<TBrand extends McpBrand> = TBrand extends "stripo" ? keyof typeof STRIPO_MCP_TOOL_MAPPING.tools : keyof typeof RETENO_MCP_TOOL_MAPPING.tools;
/** Tool names and unsupported capabilities; provider instructions define MCP arguments. */
export interface McpToolMapping<TBrand extends McpBrand = "reteno"> {
    readonly brand: TBrand;
    readonly canonicalBrand: "reteno";
    readonly fieldMapping: TBrand extends "reteno" ? "identity" : "adapter";
    readonly tools: Readonly<Partial<Record<CanonicalMcpOperation, string>>>;
    readonly auxiliaryTools?: Readonly<Record<string, string>>;
    readonly unsupported?: Readonly<Record<string, string>>;
}
export declare function supportsEmailInterfaces(brand: McpBrand): brand is EmailInterfaceMcpBrand;
export declare function getMcpOperationsForBrand<TBrand extends McpBrand>(brand: TBrand): readonly McpOperationForBrand<TBrand>[];
export declare function getMcpToolMapping(brand: "reteno"): typeof RETENO_MCP_TOOL_MAPPING;
export declare function getMcpToolMapping(brand: "stripo"): typeof STRIPO_MCP_TOOL_MAPPING;
export declare function getMcpToolMapping(brand: "reteno" | "stripo"): typeof RETENO_MCP_TOOL_MAPPING | typeof STRIPO_MCP_TOOL_MAPPING;
