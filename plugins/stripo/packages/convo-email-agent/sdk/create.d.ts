import type { EmailMutationSdkSession, IdFactory } from "./types.js";
type JsonArray = JsonValue[];
type JsonObject = {
    [key: string]: JsonValue;
};
type JsonValue = boolean | JsonArray | JsonObject | null | number | string;
export type EmailBuilderArea = "header" | "content" | "footer" | "infoArea" | string;
export interface EmailBuilderTheme {
    contentWidth?: number;
    backgroundColor?: string;
    contentBackgroundColor?: string;
    fontFamily?: string;
    fontColor?: string;
    linkColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
}
export interface CreateMinimalEmailSeedOptions {
    theme?: EmailBuilderTheme;
    idFactory?: IdFactory;
}
export interface CreateEmailBuilderOptions extends CreateMinimalEmailSeedOptions {
    seedEmailJson?: unknown;
}
export interface CreateEmailFromDraftOptions {
    /** Native editor JSON; IDs and default settings may be omitted. */
    emailJson: unknown;
    /**
     * Keep blocks whose type has no draft defaults (menu, video, and other native
     * kinds copied from a reference) instead of rejecting them. Their IDs and
     * settings are checked and preserved as supplied.
     */
    preserveNativeBlocks?: boolean;
    idFactory?: IdFactory;
}
export interface AddTextSectionOptions {
    html: string;
    area?: EmailBuilderArea;
    after?: string | EmailBuilderSection;
}
export interface AddImageSectionOptions {
    src: string;
    alt?: string;
    href?: string;
    area?: EmailBuilderArea;
    after?: string | EmailBuilderSection;
}
export interface AddButtonSectionOptions {
    text: string;
    href: string;
    area?: EmailBuilderArea;
    after?: string | EmailBuilderSection;
}
export interface AddFooterSectionOptions {
    legalHtml?: string;
    unsubscribeHref?: string;
    addressHtml?: string;
    area?: EmailBuilderArea;
    after?: string | EmailBuilderSection;
}
export interface EmailBuilderSection {
    readonly id: string;
    readonly area: EmailBuilderArea;
}
export interface EmailBuilderDiagnostics {
    readonly mutationCount: number;
    readonly sectionCount: number;
    readonly warnings: readonly string[];
    readonly validation: "pending" | "passed" | "failed";
}
export interface EmailBuilder {
    addTextSection(options: AddTextSectionOptions): EmailBuilderSection;
    addImageSection(options: AddImageSectionOptions): EmailBuilderSection;
    addButtonSection(options: AddButtonSectionOptions): EmailBuilderSection;
    addFooterSection(options: AddFooterSectionOptions): EmailBuilderSection;
    setTheme(path: string, value: unknown): EmailBuilder;
    toJSON(): unknown;
    toMutationSdk(): EmailMutationSdkSession;
    finish(): unknown;
    diagnostics(): EmailBuilderDiagnostics;
}
type MinimalComponent = {
    readonly level: "L1";
    readonly node: JsonObject;
    readonly slots: readonly {
        role: string;
        context?: string;
        blockType?: string;
        pointer: string;
    }[];
};
export declare function createMinimalEmailSeed(options?: CreateMinimalEmailSeedOptions): unknown;
/**
 * Complete a native editor draft, preserving its fields and topology except
 * for email button targets, which require a mailto: URI. Missing IDs and settings
 * receive defaults; the downloaded schema validates the completed document.
 * The caller's draft is untouched.
 */
export declare function createEmailFromDraft(options: CreateEmailFromDraftOptions): unknown;
export declare const minimalEmailComponents: Record<string, MinimalComponent>;
export declare function createEmailBuilder(options?: CreateEmailBuilderOptions): EmailBuilder;
export {};
