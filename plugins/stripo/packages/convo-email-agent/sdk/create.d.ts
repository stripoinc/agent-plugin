import type { EmailMutationSdkSession, IdFactory } from "./types.js";
import type { ChangeIntent } from './preparation.js';
import { type SocialNetworkInput } from "./social.js";
type JsonArray = JsonValue[];
type JsonObject = {
    [key: string]: JsonValue;
};
type JsonValue = boolean | JsonArray | JsonObject | null | number | string;
/** Native messageArea: header, content, footer or infoArea; other strings fail native validation. */
export type EmailBuilderArea = "header" | "content" | "footer" | "infoArea" | string;
/**
 * Seed and new-section defaults. Colors use native CSS color validation; foregrounds must be opaque.
 * Explicit node settings can override these defaults. Custom font resources must be supplied separately.
 */
export interface EmailBuilderTheme {
    /** Integer email-body width in pixels, 320..900 inclusive; default 600. */
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
    /**
     * Complete native seed; cloned, not mutated. Omitting it uses createMinimalEmailSeed.
     * Theme options supply defaults for new sections; they do not restyle an explicitly supplied seed.
     */
    seedEmailJson?: unknown;
}
export interface CreateEmailFromDraftOptions {
    /** Native draft object, not a JSON string. IDs/settings may be omitted; content and required assets must be supplied. */
    emailJson: unknown;
    /** Acquired target for validation and change intent, not visual defaults; unchanged imported metadata text may exceed 500 UTF-16 code units. */
    baselineEmailJson?: unknown;
    /** Assign new structural IDs when copying/rebuilding; defaults to false, preserving supplied IDs. */
    regenerateIds?: boolean;
    idFactory?: IdFactory;
    intent?: ChangeIntent;
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
    /** Integer pixels, 16..64 inclusive; default 32. */
    iconSize?: number;
    /** Integer pixels, 0..40 per breakpoint; default 10. A scalar sets both; an object must supply both. */
    spaceBetweenIcons?: number | {
        desktop: number;
        mobile: number;
    };
    /** left, center or right. A responsive object must supply both breakpoints with one of those values. */
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
    /**
     * Write a native settings.* path and validate before committing. Replaces the value at that path, including objects;
     * it does not perform EmailDocument.setTheme's recursive merge. Supply complete responsive/group objects.
     * Use native units (e.g. lineHeight 1.5, not 150); undefined is rejected, null only where the schema permits it.
     * A failed write leaves the draft and mutation count unchanged.
     */
    setTheme(path: string, value: unknown): EmailBuilder;
    /** Return a detached draft snapshot without sealing; use finish() for the validated final model. */
    toJSON(): unknown;
    /** Open an independent mutation session on a snapshot; subsequent edits do not update this builder. */
    toMutationSdk(): EmailMutationSdkSession;
    /**
     * Remove unused default placeholders, validate, and seal; returns native Document State, not serialized JSON.
     * A failed finish restores the draft. This method does not save remotely.
     */
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
/**
 * Native seed object with one empty text block; not a JSON string or a blockless document.
 * Applies defaults without validating caller overrides; validate before persistence.
 */
export declare function createMinimalEmailSeed(options?: CreateMinimalEmailSeedOptions): unknown;
/**
 * Complete a native editor draft, preserving its fields and topology except
 * for email button targets, which require a mailto: URI. Missing IDs and settings
 * receive defaults; the bundled editor schema validates the completed document.
 * With regenerateIds, structural nodes receive new IDs from the ID factory.
 * Saved-module identities are read-only and cannot be copied onto new nodes.
 * Native block kinds without draft defaults keep their supplied settings.
 * The baseline controls change/preservation checks; it does not supply missing visual settings.
 * Returns native Document State as unknown for boundary validation; leaves the caller's draft untouched and does not persist it.
 */
export declare function createEmailFromDraft(options: CreateEmailFromDraftOptions): unknown;
export declare const minimalEmailComponents: Record<string, MinimalComponent>;
export declare function createEmailBuilder(options?: CreateEmailBuilderOptions): EmailBuilder;
export {};
