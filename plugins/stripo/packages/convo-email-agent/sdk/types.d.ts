import type { SocialNetworkInput } from "./social.js";
import type { BlockKind, BlockSettings, DocumentState, NativeMenuItem } from './generated/document-state.js';
import type { ChangeIntent, ValidationResult } from './preparation.js';
import type { NodeIndexEntry } from './selectors.js';
export type { SocialNetworkInput } from "./social.js";
export type IdsMap = Record<string, string | number>;
/** Return a non-empty unique ID; use isTaken to avoid collisions in the destination document. */
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
    /** Zero-based match within one text run; defaults to 0. A match cannot span HTML tags. */
    occurrence?: number;
}
/**
 * Select exactly one anchor in a text block. href matches exactly; text compares whitespace-normalized visible text.
 * Zero or multiple matches throw. Replacement text is inserted as HTML; escape literal markup when needed.
 */
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
    /**
     * Native link destination. Empty removes image/social links; button links still need a schema-valid value.
     * For non-social setters, explicit schemes are limited to http, https, mailto and tel; native type rules also apply.
     */
    url: string;
    /**
     * Defaults to site on button/image blocks; social links infer their type from the URL.
     * Must match the selected block's native link union; use mailto:/tel:/# with the matching type.
     */
    linkType?: string;
    /** Required for a social block: existing network type. Use setSocialNetwork with an index for repeated types. */
    network?: string;
}
/** A social network addressed by its type ("instagram") or its zero-based index in settings.networks. */
export type SocialNetworkTarget = number | string;
/** Fields of one social network entry; `url: ""` removes its link. */
export type SocialNetworkMutation = {
    url?: string;
    /** site, anchor, email, phone, file, sms, telegram, viber or other; omitted values are inferred from url. */
    linkType?: string;
    /** At most 100 UTF-16 code units (String.length). */
    title?: string;
    /** At most 500 UTF-16 code units; requires textCustomization on the block. */
    alt?: string;
    /** Custom networks only; known networks take their icon from type and style. */
    icon?: string;
    link_type?: string;
};
export type SocialSharedMutation = {
    /** Native icon-style enum, e.g. logoColored, logoBlack, circleColored. Inspect the social settings schema for all values. */
    style?: string;
    /** Integer pixels, 16..64 inclusive. */
    iconSize?: number;
    /** Integer pixels, 0..40 per breakpoint. A scalar sets both; an object must contain both desktop and mobile. */
    spaceBetweenIcons?: number | {
        desktop: number;
        mobile: number;
    };
    /** Turning it on gives every network an alt (title fallback); turning it off removes them. */
    textCustomization?: boolean;
    /** Legacy alias of iconSize; the same 16..64 integer range applies. */
    icon_size?: number;
    /** Legacy alias of spaceBetweenIcons; the same complete responsive shape and 0..40 range apply. */
    space_between_icons?: number | {
        desktop: number;
        mobile: number;
    };
    /** Legacy alias of textCustomization. */
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
/**
 * Finite unitless multiplier, 0..5 inclusive (1.5 = 150%); not pixels or a percentage.
 * Fractions are allowed; 0.1 is a UI step, not a validation increment.
 * A responsive object updates its named breakpoints and preserves omitted ones; null is not accepted here.
 */
export type LineHeightValue = number | {
    desktop: number;
    mobile?: number;
} | {
    desktop?: number;
    mobile: number;
};
/** Native areas are header, content, footer and infoArea. The string escape hatch does not make other areas valid. */
export type StyleArea = "header" | "content" | "footer" | "infoArea" | string;
export type StripeBackgroundTarget = "content" | "stripe";
export type StyleOptions = {
    /**
     * Defaults to both for scalar responsive values. Explicit desktop/mobile keys select their own breakpoints.
     * Only responsive settings honor this option; it cannot make a color or font family responsive.
     */
    breakpoint?: StyleBreakpoint;
    /** Only for backgroundColor; defaults to content. On stripes selects the centered content or outer stripe surface. */
    backgroundTarget?: StripeBackgroundTarget;
    /** Theme styles only; defaults to content. Node styles reject this option. Ignored by shared fontFamily/lineHeight. */
    area?: StyleArea;
};
export interface EmailNodeStyleApi {
    /**
     * Use an SDK property name, not CSS or a dotted JSON path. Support depends on the node kind.
     * Aliases: backgroundColor, fontColor, fontSize, fontFamily, bold, italic, textAlign, padding, margin, border, borderRadius.
     * Each named helper below defines its value shape and supported targets; unsupported pairs throw.
     * Native settings outside these aliases use EmailNode.patchSettings instead.
     */
    set(property: string, value: unknown, options?: StyleOptions): EmailNode;
    readonly background: {
        /**
         * Background on button/social/container/structure/stripe. Hex (#RGB/#RRGGBB/#RRGGBBAA), comma-form rgb()/rgba(),
         * or an SDK-supported named color; transparent is allowed. Prefer #RRGGBB over relying on every CSS color syntax.
         */
        setColor(value: unknown, options?: StyleOptions): EmailNode;
    };
    readonly typography: {
        /**
         * Opaque foreground color on text/button blocks; same color syntax as background.setColor, without transparency.
         * On text blocks a native color write may recolor descendants during editor persistence, including inline spans.
         */
        setColor(value: unknown): EmailNode;
        /**
         * Button font size in pixels, finite 8..72 inclusive; number or non-empty {desktop?, mobile?}.
         * Omitted breakpoints keep their current values. Text blocks have no fontSize setting; use semantic content/theme typography.
         */
        setSize(value: unknown, options?: StyleOptions): EmailNode;
        /** Button font-family stack as a non-blank string. Custom font declarations belong in document resources.fonts. */
        setFamily(value: unknown): EmailNode;
        /** Boolean on button blocks; preserves italic. Text-block emphasis belongs in semantic HTML. */
        setBold(value: unknown): EmailNode;
        /** Boolean on button blocks; preserves bold. Text-block emphasis belongs in semantic HTML. */
        setItalic(value: unknown): EmailNode;
    };
    readonly layout: {
        /**
         * left, center or right on text/button/image/social; text also permits justify.
         * Accepts a scalar or non-empty {desktop?, mobile?}; omitted breakpoints are preserved.
         */
        setAlignment(value: unknown, options?: StyleOptions): EmailNode;
        /**
         * Pixel number, non-empty {top?, right?, bottom?, left?}, or {desktop?, mobile?} containing either form.
         * Supports button/container/structure and mobile-only stripe padding; omitted sides/breakpoints are preserved.
         * Buttons require 0..1000; layout sides are bounded by the SDK to -1000000..1000000. CSS strings are rejected.
         */
        setPadding(value: unknown, options?: StyleOptions): EmailNode;
        /**
         * Same scalar/side/responsive forms as setPadding, written to native margins.
         * Button/image/social sides require 0..1000 px; structure sides allow -1000000..1000000. No other targets.
         */
        setMargin(value: unknown, options?: StyleOptions): EmailNode;
    };
    readonly border: {
        /**
         * Border on button/container/structure/stripe. Use {width?, color?, style?} for all sides, or
         * {top?, right?, bottom?, left?, style?}, with each supplied side {width?, color?}; do not mix the forms.
         * Widths are 0..100 px; style is solid, dashed or dotted; colors may be transparent. Missing values are preserved.
         */
        set(value: unknown): EmailNode;
        /**
         * Pixels, 0..1000: a number or non-empty {topLeft?, topRight?, bottomRight?, bottomLeft?}.
         * Button/container/structure use one corner object. Images also accept {desktop?, mobile?} of these forms
         * and honor breakpoint. Omitted corners/breakpoints are preserved.
         */
        setRadius(value: unknown, options?: StyleOptions): EmailNode;
    };
}
export interface EmailThemeApi {
    /** Same contract as EmailDocument.setTheme: native settings.* path, recursive object merge, schema-limited resets. */
    set(path: string, value: unknown): EmailDocument;
    readonly style: {
        /**
         * Theme aliases: backgroundColor, fontColor, linkColor, fontSize, fontFamily, lineHeight.
         * Colors target settings.stripes.lightTheme in the selected area; headings/buttons/local overrides are separate.
         * Use setTheme for native fields or authored darkTheme values outside these aliases.
         */
        set(property: string, value: unknown, options?: StyleOptions): EmailDocument;
        readonly background: {
            /** Area content background in lightTheme; same color syntax as node backgrounds, including transparent. */
            setContentColor(value: unknown, options?: StyleOptions): EmailDocument;
            /** Area outer stripe background in lightTheme; same color syntax as node backgrounds, including transparent. */
            setStripeColor(value: unknown, options?: StyleOptions): EmailDocument;
        };
        readonly typography: {
            /** Area body-text color in lightTheme; opaque color syntax as in EmailNodeStyleApi.typography.setColor. */
            setColor(value: unknown, options?: StyleOptions): EmailDocument;
            /** Area body font size: finite 8..72 px, number or non-empty {desktop?, mobile?}; omitted breakpoints stay unchanged. */
            setSize(value: unknown, options?: StyleOptions): EmailDocument;
            /** Shared stripes font-family stack, a non-blank string; heading/button font families are separate. */
            setFamily(value: unknown): EmailDocument;
            /**
             * Shared stripe line height, not per-area. Uses LineHeightValue (0..5 multiplier).
             * Reset a heading leaf with setTheme("settings.headings.h1.lineHeight.mobile", null); stripes do not allow null.
             */
            setLineHeight(value: LineHeightValue, options?: StyleOptions): EmailDocument;
        };
        readonly link: {
            /** Area link color in lightTheme, opaque; does not replace local anchor styles. */
            setColor(value: unknown, options?: StyleOptions): EmailDocument;
        };
    };
}
export interface EmailNode {
    readonly id: string;
    readonly style: EmailNodeStyleApi;
    inspect(): NodeIndexEntry;
    /**
     * Returns frozen {kind, settings, capabilities}: pinned JSON settings schema and native operation support.
     * Settings may contain $ref; resolve against getJsonSchema(). This describes native fields, not SDK style aliases.
     */
    describe(): unknown;
    /**
     * Deep patch of native settings; omitted fields are preserved. Unknown/read-only keys, undefined and arrays are rejected.
     * Use collection methods for networks/items. Changing a type/mode discriminator requires the complete new variant.
     * Use email.block(id, kind).patchSettings for block-specific TypeScript checking; runtime validation still applies.
     */
    patchSettings(patch: Record<string, unknown>): EmailNode;
    /** Currently only ["link"] on image blocks. Other node fields cannot be reset through this method. */
    resetSettings(paths: readonly string[]): EmailNode;
    /** Replace content verbatim on text/html/unknown blocks, without the setContent formatting transplant. */
    setHtml(html: string): EmailNode;
    /** Toggle extension only on an unknown block; the operation still requires native runtime support. */
    setExtension(enabled: boolean): EmailNode;
    /**
     * Switch spacer variant and remove incompatible fields. settings is a native patch for the resulting variant.
     * Space height is {desktop, mobile}, integer 5..1000 px. For line width/border/alignment inspect describe().settings.
     */
    setSpacerMode(mode: 'line' | 'space', settings?: Record<string, unknown>): EmailNode;
    /** Menu only: perItem, links, icons or linksWithIcons. Switching to links removes item images. */
    setMenuMode(mode: string): EmailNode;
    /**
     * Append a complete native menu item, or insert before/after a zero-based existing item index.
     * The item must satisfy the current shared/per-item menu mode; image requirements depend on that mode.
     */
    addMenuItem(item: NativeMenuItem, position?: {
        before: number;
    } | {
        after: number;
    }): EmailNode;
    /** Deep patch one existing zero-based item. A type/mode change must include its complete new variant. */
    updateMenuItem(index: number, patch: DeepPatch<NativeMenuItem>): EmailNode;
    removeMenuItem(index: number): EmailNode;
    /** Move an existing zero-based item relative to another item; both indices refer to the list before the move. */
    moveMenuItem(index: number, position: {
        before: number;
    } | {
        after: number;
    }): EmailNode;
    moveSocialNetwork(target: SocialNetworkTarget, position: SocialNetworkPosition): EmailNode;
    /** Insert a copy with fresh subtree IDs; defaults to after this node. Native insertion restrictions still apply. */
    duplicate(position?: InsertPosition): EmailNode;
    move(position: InsertPosition): EmailNode;
    byId(id: string, disambiguateBy?: DisambiguateBy): EmailNode;
    /**
     * For text blocks, supply semantic HTML/plain text. Incoming style/class attributes are dropped and original
     * formatting is transplanted; the first original instance of each tag supplies that tag's template.
     * Use setHtml for a verbatim content write. This method does not expose per-paragraph mobile font-size settings.
     */
    setContent(value: string): EmailNode;
    /** Use for button text. Text blocks use the same format transplant as setContent; images reject this method. */
    setText(value: string): EmailNode;
    /** Replace an existing native image source; does not upload or generate an asset. Native source validation applies. */
    setSrc(url: string): EmailNode;
    /** Update an existing native link destination, preserving its type. Use setLink to create/remove a link or change type. */
    setHref(url: string): EmailNode;
    /** Image alternative text; at most 500 UTF-16 code units (String.length). */
    setAlt(text: string): EmailNode;
    /** Update an existing title field on this node; this does not change the document title (use setMetadata). */
    setTitle(text: string): EmailNode;
    /**
     * Text blocks: replace one literal occurrence within one HTML text run. Buttons: match the whole normalized label.
     * Replacement is not HTML-escaped; this is not a regex or a match spanning tags.
     */
    replaceText(match: string, replace: string, options?: TextReplacementOptions): EmailNode;
    setTextLink(mutation: TextLinkMutation): EmailNode;
    /** Button/image/social native link edit; see LinkMutation for type, empty-value and social-target rules. */
    setLink(mutation: LinkMutation): EmailNode;
    /** Alias of style.set; see EmailNodeStyleApi for supported properties, target kinds, units and value shapes. */
    setStyle(property: string, value: unknown, options?: StyleOptions): EmailNode;
    setMenuItem(itemIndex: number, set: MenuItemMutation): EmailNode;
    setMenuShared(set: MenuSharedMutation): EmailNode;
    /** Edit an existing network; a string type must resolve uniquely. Use its zero-based index for duplicate types. */
    setSocialNetwork(target: SocialNetworkTarget, set: SocialNetworkMutation): EmailNode;
    /** Append by default or insert relative to an existing network. See SocialNetworkInput for custom-icon/link rules. */
    addSocialNetwork(network: SocialNetworkInput, position?: SocialNetworkPosition): EmailNode;
    removeSocialNetwork(target: SocialNetworkTarget): EmailNode;
    setSocialShared(set: SocialSharedMutation): EmailNode;
    /** Delete the selected subtree, subject to pinned native operation support; acquired timer blocks cannot be deleted. */
    remove(): void;
    /**
     * Final total count, integer >= 1, not the number of extra copies. Replaces the source with fresh-ID instances.
     * Call once per source and continue through the returned handles; old handles cannot mutate the replaced nodes.
     * Inserted components and subtrees containing acquired timer blocks cannot be repeated.
     */
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
/**
 * Native document metadata. Omitted fields keep their current values; a patch must contain at least one field.
 * New/changed title and preheader text are limited to 500 UTF-16 code units each.
 * An unchanged longer imported value may be preserved against the acquired baseline.
 */
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
    /** Resolve a native or mapped compact ID. Ambiguous IDs need scope/kind/occurrence in disambiguateBy. */
    byId(id: string, disambiguateBy?: DisambiguateBy): EmailNode;
    select(selector: EmailMutationSelector): EmailNode[];
    /** Without an explicit limit, requires exactly one match; use limit: 1 to take the first. Zero matches throw. */
    first(selector: EmailMutationSelector): EmailNode;
    /** Requires exactly one match and ignores selector.limit; throws for zero or multiple matches. */
    one(selector: EmailMutationSelector): EmailNode;
    block<K extends BlockKind>(id: string, expectedType: K): TypedBlockNode<K>;
    /**
     * Deep patch native document settings, preserving omitted fields. Unknown keys, undefined and arbitrary arrays fail.
     * A changed type/mode requires its complete new variant; use resetSettings for supported clearing operations.
     */
    patchSettings(patch: DeepPatch<DocumentState['settings']>): EmailDocument;
    /**
     * Reset nullable native theme fields to null; paths may include or omit settings.
     * Whole non-nullable groups cannot be reset. This is not deletion of keys or a reset to builder defaults.
     */
    resetSettings(paths: readonly string[]): EmailDocument;
    /** Replace native font resources. Each fontFamily key matches the complete assigned stack, including fallbacks. */
    setFonts(fonts: NonNullable<NonNullable<DocumentState['resources']>['fonts']>): EmailDocument;
    setContent(id: string, value: string, disambiguateBy?: DisambiguateBy): EmailNode;
    setText(id: string, value: string, disambiguateBy?: DisambiguateBy): EmailNode;
    setSrc(id: string, url: string, disambiguateBy?: DisambiguateBy): EmailNode;
    setHref(id: string, url: string, disambiguateBy?: DisambiguateBy): EmailNode;
    setAlt(id: string, text: string, disambiguateBy?: DisambiguateBy): EmailNode;
    setTitle(id: string, text: string, disambiguateBy?: DisambiguateBy): EmailNode;
    remove(id: string, disambiguateBy?: DisambiguateBy): void;
    repeat(id: string, totalCount: number, disambiguateBy?: DisambiguateBy): EmailNode[];
    /**
     * Native dot path beginning settings.; array-index segments are rejected. Object values merge recursively.
     * Values use the native JSON shape/units, without style-helper shorthands or named-color conversion.
     * null/undefined reset only schema-nullable fields (including nullable leaves inside a patch); other resets throw.
     * Example: setTheme("settings.headings.h1.lineHeight.mobile", 1.5). The complete candidate is validated.
     */
    setTheme(path: string, value: unknown): EmailDocument;
    /** Alias of theme.style.set; see EmailThemeApi for supported properties, light-theme scope and value shapes. */
    setStyle(property: string, value: unknown, options?: StyleOptions): EmailDocument;
    /**
     * Insert a complete native component of the anchor's structural kind, with fresh subtree IDs.
     * A string names an entry in components/library; it is not a filesystem path to load. Use returned slot handles.
     */
    insert(componentFile: string | EmailComponent, position: InsertPosition): InsertedEmailNode;
    /**
     * Append a complete native node with an ID; no draft-default completion. Without parent, requires a stripe.
     * With parent, requires the next native level (stripe/structure/column/container/block).
     * All subtree IDs are regenerated; use the returned handle.
     */
    append(node: unknown, parent?: string | EmailNode): EmailNode;
    /**
     * Copy one unambiguous node from a complete validated native document, assigning fresh IDs.
     * Imports used font resources; conflicting font definitions and module/extension bindings are rejected.
     */
    insertFrom(reference: unknown, nodeId: string, position: InsertPosition): InsertedEmailNode;
}
export interface EmailLibrarySlot {
    role: string;
    context?: string;
    blockType?: string;
    /** RFC 6901 JSON pointer relative to the component node, not the destination document. */
    pointer: string;
}
export interface EmailLibraryComponent {
    /** Library-relative key, e.g. "L2/bullet_row.json"; insert() does not read files. */
    file: string;
    level: "L1" | "L2" | "atoms";
    /** Complete native stripe/structure/column/container/block subtree, including settings and child arrays. */
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
    /** Zero-based occurrence after applying kind/parent filters; must be a non-negative integer within the matches. */
    occurrence?: number;
}
/** Patch one existing menu item; camelCase fields take precedence over their legacy snake_case aliases. */
export type MenuItemMutation = {
    /** Opaque color using the node style helpers' color syntax. */
    itemLinkColor?: string;
    /** Same color syntax as itemLinkColor, but transparency is allowed. */
    itemBackgroundColor?: string;
    itemLinkValue?: string;
    /** site, email, phone or anchor; applied only when itemLinkValue is also supplied. */
    itemLinkType?: string;
    /** Non-blank menu label. */
    itemName?: string;
    item_link_color?: string;
    item_background_color?: string;
    item_link_value?: string;
    item_link_type?: string;
    item_name?: string;
};
export type MenuSharedMutation = {
    /** Opaque color; switches menu colors to shared mode. */
    sharedLinkColor?: string;
    shared_link_color?: string;
};
export interface CreateEmailSdkOptions {
    /**
     * Complete native Document State object, not serialized JSON or a partial patch.
     * Only plain JSON data is accepted: no undefined, NaN/Infinity, cycles, functions, class instances or accessors.
     */
    emailJson: unknown;
    /** Optional mapping from real document IDs to caller-facing compact IDs. */
    idsMap?: IdsMap;
    idMap?: IdsMap;
    /** Optional representative ID to collapsed sibling IDs supplied by the host. */
    repeatSiblings?: Record<string, string[]>;
    /** Preloaded components keyed by library-relative name; needed for string-based insert() when not in components. */
    library?: ReadonlyMap<string, EmailLibraryComponent>;
    components?: ReadonlyMap<string, EmailComponent> | Record<string, EmailComponent>;
    idFactory?: IdFactory;
    /** Used by create/import wrappers; an edit otherwise uses emailJson as current. */
    current?: unknown;
    /** Exact intentional removals/resets/collection replacements for import wrappers; does not bypass native validation. */
    intent?: ChangeIntent;
}
/** Type-level partial shape only; individual patch methods still reject arrays and unsupported resets at runtime. */
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
    /** Validate the complete change and seal the session; later mutations throw. No remote persistence occurs. */
    finish(): DocumentState;
    /** Unchecked draft snapshot retained for older scripts. Use finish() before upload. */
    toJSON(): unknown;
    /** Detached draft snapshot; the declared type is not proof of validation. Use finish() before persistence. */
    snapshot(): DocumentState;
    /** Check the current candidate without sealing or saving it; success establishes the pinned contract only. */
    validate(): ValidationResult;
    /**
     * Synchronous callback only; promises are rejected. The outer transaction validates and rolls back on failure.
     * Call finish() after the transaction, not inside it.
     */
    transaction<T>(callback: (email: EmailDocument) => T): T;
    changes(): readonly EmailChangeRecord[];
    /** Compact inspection summary for locating content; not the full native model or a validation result. */
    inspect(): unknown;
    /** Requires a non-blank reason and an unchanged draft. Signals a deliberate no-op; it does not persist anything. */
    skip(reason: string): void;
    readonly version: number;
    /** Frozen clone of the acquired baseline, distinct from the mutable draft. */
    readonly current: unknown;
    diagnostics(): EmailDiagnostics;
    readonly mutationCount: number;
}
export type EmailMutationSdkSession = EmailSdkSession;
