export type MergeServiceFontRole = "body" | "headings" | "buttons";
export declare const MERGE_SERVICE_DEFAULT_FONT_FAMILY = "arial,'helvetica neue',helvetica,sans-serif";
export declare const MERGE_SERVICE_FONT_SUBSTITUTION_REASON = "merge_service_font_connection_unavailable";
export interface MergeServiceFontBaseline {
    /** Role-specific shell/target stacks used only when normalizing inline CSS. */
    readonly body: string;
    readonly headings: string;
    readonly buttons: string;
    /** The only structured stack accepted for document-state/set. */
    readonly structuredValues: readonly string[];
}
export interface MergeServiceFontSubstitution {
    readonly path: string;
    readonly source: "structured" | "inline_css";
    readonly role: MergeServiceFontRole;
    readonly requested: string;
    readonly persisted: string;
    readonly reason: typeof MERGE_SERVICE_FONT_SUBSTITUTION_REASON;
}
export interface MergeServiceFontViolation {
    readonly path: string;
    readonly fontFamily: string;
}
export interface MergeServiceFontCompatibilityOptions {
    candidateEmailJson: unknown;
    baselineEmailJson: unknown;
    fallbackFontFamily?: string;
}
export interface MergeServiceFontCompatibilityResult {
    readonly emailJson: unknown;
    readonly baseline: MergeServiceFontBaseline;
    readonly diagnostics: readonly MergeServiceFontSubstitution[];
}
export declare class MergeServiceFontCompatibilityError extends Error {
    readonly code = "merge_service_font_connection_unavailable";
    readonly violations: readonly MergeServiceFontViolation[];
    constructor(violations: readonly MergeServiceFontViolation[]);
}
/** Compare CSS font stacks without case, quoting, or whitespace differences. */
export declare function canonicalizeFontFamily(fontFamily: string): string;
/**
 * Fail closed unless every structured font stack is canonically equivalent to
 * the single stack known to be safe for Reteno document-state/set.
 */
export declare function assertMergeServiceFontCompatible(options: MergeServiceFontCompatibilityOptions): void;
/**
 * Opt-in Reteno mergeService compatibility transform. The candidate and
 * baseline are cloned; neither caller-owned object is mutated.
 */
export declare function normalizeMergeServiceFonts(options: MergeServiceFontCompatibilityOptions): MergeServiceFontCompatibilityResult;
