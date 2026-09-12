import type { SocialNetworkInput } from "./social.js";
import type { BlockKind, BlockSettings, DocumentState, NativeMenuItem } from './generated/document-state.js';
import type { ChangeIntent, ValidationResult } from './preparation.js';
import type { NodeIndexEntry } from './selectors.js';
export type { SocialNetworkInput } from "./social.js";
export type IdsMap = Record<string, string | number>;
export type IdFactory = (seed: string, isTaken: (id: string) => boolean) => string;
export type EffectiveVisibility = "both" | "desktop-only" | "mobile-only" | "neither";
export interface EmailMutationSelector {
    nodeKind?: "stripe" | "structure" | "column" | "container" | "block";
    type?: string;
    inMessageArea?: "header" | "content" | "footer" | "infoArea" | string;
    effectiveVisibility?: EffectiveVisibility;
    moduleId?: string | number | "present" | "absent";
    hasLink?: boolean;
    linkHostContains?: string;
    textContains?: string;
    limit?: number;
    within?: string | EmailNode;
}
export interface EmailDiagnostics {
    mutationCount: number;
    warnings: readonly string[];
    selectorMisses: readonly {
        selector: EmailMutationSelector;
        message: string;
    }[];
    validation: "pending" | "passed" | "failed";
    skipped?: string;
}
export interface TextReplacementOptions {
    occurrence?: number;
}
export interface TextLinkMutation {
    match: {
        text?: string;
        href?: string;
    };
    set: {
        href?: string;
        target?: "_blank" | "_self" | "_parent" | "_top" | "";
        text?: string;
    };
}
export interface LinkMutation {
    url: string;
    linkType?: string;
    network?: string;
}
/** A social network addressed by its type ("instagram") or its zero-based index in settings.networks. */
export type SocialNetworkTarget = number | string;
/** Fields of one social network entry; `url: ""` removes its link. */
export type SocialNetworkMutation = {
    url?: string;
    linkType?: string;
    title?: string;
    /** Requires textCustomization on the block (setSocialShared({textCustomization: true})). */
    alt?: string;
    /** Custom networks only; known networks take their icon from type and style. */
    icon?: string;
    link_type?: string;
};
export type SocialSharedMutation = {
    style?: string;
    iconSize?: number;
    spaceBetweenIcons?: number | {
        desktop: number;
        mobile: number;
    };
    /** Turning it on gives every network an alt (title fallback); turning it off removes them. */
    textCustomization?: boolean;
    icon_size?: number;
    space_between_icons?: number | {
        desktop: number;
        mobile: number;
    };
    text_customization?: boolean;
};
export type SocialNetworkPosition = {
    after: SocialNetworkTarget;
    before?: never;
} | {
    before: SocialNetworkTarget;
    after?: never;
};
export type StyleBreakpoint = "desktop" | "mobile" | "both";
export type StyleArea = "header" | "content" | "footer" | "infoArea" | string;
export type StripeBackgroundTarget = "content" | "stripe";
export type StyleOptions = {
    breakpoint?: StyleBreakpoint;
    backgroundTarget?: StripeBackgroundTarget;
    area?: StyleArea;
};
export interface EmailNodeStyleApi {
    set(property: string, value: unknown, options?: StyleOptions): EmailNode;
    readonly background: {
        setColor(value: unknown, options?: StyleOptions): EmailNode;
    };
    readonly typography: {
        setColor(value: unknown): EmailNode;
        setSize(value: unknown, options?: StyleOptions): EmailNode;
        setFamily(value: unknown): EmailNode;
        setBold(value: unknown): EmailNode;
        setItalic(value: unknown): EmailNode;
    };
    readonly layout: {
        setAlignment(value: unknown, options?: StyleOptions): EmailNode;
        setPadding(value: unknown, options?: StyleOptions): EmailNode;
        setMargin(value: unknown, options?: StyleOptions): EmailNode;
    };
    readonly border: {
        set(value: unknown): EmailNode;
        setRadius(value: unknown, options?: StyleOptions): EmailNode;
    };
}
export interface EmailThemeApi {
    set(path: string, value: unknown): EmailDocument;
    readonly style: {
        set(property: string, value: unknown, options?: StyleOptions): EmailDocument;
        readonly background: {
            setContentColor(value: unknown, options?: StyleOptions): EmailDocument;
            setStripeColor(value: unknown, options?: StyleOptions): EmailDocument;
        };
        readonly typography: {
            setColor(value: unknown, options?: StyleOptions): EmailDocument;
            setSize(value: unknown, options?: StyleOptions): EmailDocument;
            setFamily(value: unknown): EmailDocument;
            setLineHeight(value: unknown, options?: StyleOptions): EmailDocument;
        };
        readonly link: {
            setColor(value: unknown, options?: StyleOptions): EmailDocument;
        };
    };
}
export interface EmailNode {
    readonly id: string;
    readonly style: EmailNodeStyleApi;
    inspect(): NodeIndexEntry;
    describe(): unknown;
    patchSettings(patch: Record<string, unknown>): EmailNode;
    resetSettings(paths: readonly string[]): EmailNode;
    setHtml(html: string): EmailNode;
    setExtension(enabled: boolean): EmailNode;
    setSpacerMode(mode: 'line' | 'space', settings?: Record<string, unknown>): EmailNode;
    setMenuMode(mode: string): EmailNode;
    addMenuItem(item: NativeMenuItem, position?: {
        before: number;
    } | {
        after: number;
    }): EmailNode;
    updateMenuItem(index: number, patch: DeepPatch<NativeMenuItem>): EmailNode;
    removeMenuItem(index: number): EmailNode;
    moveMenuItem(index: number, position: {
        before: number;
    } | {
        after: number;
    }): EmailNode;
    moveSocialNetwork(target: SocialNetworkTarget, position: SocialNetworkPosition): EmailNode;
    duplicate(position?: InsertPosition): EmailNode;
    move(position: InsertPosition): EmailNode;
    byId(id: string, disambiguateBy?: DisambiguateBy): EmailNode;
    setContent(value: string): EmailNode;
    setText(value: string): EmailNode;
    setSrc(url: string): EmailNode;
    setHref(url: string): EmailNode;
    setAlt(text: string): EmailNode;
    setTitle(text: string): EmailNode;
    replaceText(match: string, replace: string, options?: TextReplacementOptions): EmailNode;
    setTextLink(mutation: TextLinkMutation): EmailNode;
    setLink(mutation: LinkMutation): EmailNode;
    setStyle(property: string, value: unknown, options?: StyleOptions): EmailNode;
    setMenuItem(itemIndex: number, set: MenuItemMutation): EmailNode;
    setMenuShared(set: MenuSharedMutation): EmailNode;
    setSocialNetwork(target: SocialNetworkTarget, set: SocialNetworkMutation): EmailNode;
    addSocialNetwork(network: SocialNetworkInput, position?: SocialNetworkPosition): EmailNode;
    removeSocialNetwork(target: SocialNetworkTarget): EmailNode;
    setSocialShared(set: SocialSharedMutation): EmailNode;
    remove(): void;
    repeat(totalCount: number): EmailNode[];
}
export interface InsertedEmailNode extends EmailNode {
    slot(role: string, context?: string): EmailNode;
}
export type InsertPosition = {
    after: string | EmailNode;
    before?: never;
} | {
    before: string | EmailNode;
    after?: never;
};
/** Native document metadata. Omitted fields keep their current values. */
export interface EmailMetadataPatch {
    /** HTML <head><title>; an empty string clears it. */
    title?: string;
    /** Both fields are required. Empty text with fillSpace=false clears the preheader. */
    preheader?: {
        text: string;
        fillSpace: boolean;
    };
}
export interface EmailDocument {
    readonly theme: EmailThemeApi;
    setMetadata(patch: EmailMetadataPatch): EmailDocument;
    byId(id: string, disambiguateBy?: DisambiguateBy): EmailNode;
    select(selector: EmailMutationSelector): EmailNode[];
    first(selector: EmailMutationSelector): EmailNode;
    one(selector: EmailMutationSelector): EmailNode;
    block<K extends BlockKind>(id: string, expectedType: K): TypedBlockNode<K>;
    patchSettings(patch: DeepPatch<DocumentState['settings']>): EmailDocument;
    resetSettings(paths: readonly string[]): EmailDocument;
    setFonts(fonts: NonNullable<NonNullable<DocumentState['resources']>['fonts']>): EmailDocument;
    setContent(id: string, value: string, disambiguateBy?: DisambiguateBy): EmailNode;
    setText(id: string, value: string, disambiguateBy?: DisambiguateBy): EmailNode;
    setSrc(id: string, url: string, disambiguateBy?: DisambiguateBy): EmailNode;
    setHref(id: string, url: string, disambiguateBy?: DisambiguateBy): EmailNode;
    setAlt(id: string, text: string, disambiguateBy?: DisambiguateBy): EmailNode;
    setTitle(id: string, text: string, disambiguateBy?: DisambiguateBy): EmailNode;
    remove(id: string, disambiguateBy?: DisambiguateBy): void;
    repeat(id: string, totalCount: number, disambiguateBy?: DisambiguateBy): EmailNode[];
    setTheme(path: string, value: unknown): EmailDocument;
    setStyle(property: string, value: unknown, options?: StyleOptions): EmailDocument;
    insert(componentFile: string | EmailComponent, position: InsertPosition): InsertedEmailNode;
    /** Append a native stripe to the document, or a native child to a layout node. */
    append(node: unknown, parent?: string | EmailNode): EmailNode;
    insertFrom(reference: unknown, nodeId: string, position: InsertPosition): InsertedEmailNode;
}
export interface EmailLibrarySlot {
    role: string;
    context?: string;
    blockType?: string;
    pointer: string;
}
export interface EmailLibraryComponent {
    file: string;
    level: "L1" | "L2" | "atoms";
    node: unknown;
    slots: readonly EmailLibrarySlot[];
}
export type EmailComponentSlot = EmailLibrarySlot;
export type EmailComponent = Omit<EmailLibraryComponent, "file" | "level"> & {
    file?: string;
    level?: "L1" | "L2" | "atoms";
};
export interface DisambiguateBy {
    nodeKind?: EmailMutationSelector['nodeKind'];
    parentContainerId?: string;
    parent_container_id?: string;
    parentStripeId?: string;
    parent_stripe_id?: string;
    occurrence?: number;
}
export type MenuItemMutation = {
    itemLinkColor?: string;
    itemBackgroundColor?: string;
    itemLinkValue?: string;
    itemLinkType?: string;
    itemName?: string;
    item_link_color?: string;
    item_background_color?: string;
    item_link_value?: string;
    item_link_type?: string;
    item_name?: string;
};
export type MenuSharedMutation = {
    sharedLinkColor?: string;
    shared_link_color?: string;
};
export interface CreateEmailSdkOptions {
    emailJson: unknown;
    idsMap?: IdsMap;
    idMap?: IdsMap;
    repeatSiblings?: Record<string, string[]>;
    library?: ReadonlyMap<string, EmailLibraryComponent>;
    components?: ReadonlyMap<string, EmailComponent> | Record<string, EmailComponent>;
    idFactory?: IdFactory;
    /** Used by create/import wrappers; an edit otherwise uses emailJson as current. */
    current?: unknown;
    intent?: ChangeIntent;
}
export type DeepPatch<T> = T extends readonly unknown[] ? T : T extends object ? {
    [K in keyof T]?: DeepPatch<T[K]>;
} : T;
export type TypedBlockNode<K extends BlockKind> = Omit<EmailNode, 'patchSettings'> & {
    patchSettings(patch: DeepPatch<Omit<BlockSettings<K>, 'networks' | 'items'>>): TypedBlockNode<K>;
};
export interface EmailChangeRecord {
    operation: number;
    type: string;
    nodeId?: string;
    nodeType?: string;
    transaction?: number;
    origin?: {
        kind: 'component' | 'reference' | 'native';
        nodeId?: string;
        source?: string;
    };
    /** Addresses of the touched and inserted nodes; snapshots stay in the session, not the log. */
    paths: readonly string[];
    insertedIds: readonly string[];
    intent: ChangeIntent;
}
export interface EmailSdkSession {
    email: EmailDocument;
    finish(): DocumentState;
    /** Unchecked draft snapshot retained for older scripts. Use finish() before upload. */
    toJSON(): unknown;
    snapshot(): DocumentState;
    validate(): ValidationResult;
    transaction<T>(callback: (email: EmailDocument) => T): T;
    changes(): readonly EmailChangeRecord[];
    inspect(): unknown;
    skip(reason: string): void;
    readonly version: number;
    readonly current: unknown;
    diagnostics(): EmailDiagnostics;
    readonly mutationCount: number;
}
export type EmailMutationSdkSession = EmailSdkSession;
