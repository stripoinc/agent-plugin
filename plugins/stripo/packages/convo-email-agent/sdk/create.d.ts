import type { EmailMutationSdkSession, IdFactory } from "./types.js";
import { type SocialNetworkInput } from "./social.js";
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
    /** Acquired target model for a rebuild; unchanged imported metadata text may exceed 500 UTF-16 code units. */
    baselineEmailJson?: unknown;
    /** Assign new structural IDs when copying or fully replacing a document. */
    regenerateIds?: boolean;
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
/** Native social block from caller-facing network descriptions; omitted settings take the editor defaults. */
export interface SocialBlockOptions {
    networks: readonly SocialNetworkInput[];
    /** One of the editor's icon styles, e.g. "logoColored" (default), "logoBlack", "circleColored". */
    style?: string;
    /** 16..64, default 32. */
    iconSize?: number;
    /** 0..40 per breakpoint, default 10. */
    spaceBetweenIcons?: number | {
        desktop: number;
        mobile: number;
    };
    alignment?: "left" | "center" | "right" | {
        desktop: string;
        mobile: string;
    };
    /** Defaults to true when any network supplies alt; when true every network gets alt (title fallback). */
    textCustomization?: boolean;
}
export interface AddSocialSectionOptions extends SocialBlockOptions {
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
    addSocialSection(options: AddSocialSectionOptions): EmailBuilderSection;
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
 * receive defaults; the bundled editor schema validates the completed document.
 * With regenerateIds, structural nodes receive new IDs from the ID factory.
 * Native block kinds without draft defaults keep their supplied settings.
 * The caller's draft is untouched.
 */
export declare function createEmailFromDraft(options: CreateEmailFromDraftOptions): unknown;
export declare const minimalEmailComponents: Record<string, MinimalComponent>;
export declare function createEmailBuilder(options?: CreateEmailBuilderOptions): EmailBuilder;
export {};
