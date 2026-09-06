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
}
export interface EmailDiagnostics {
    mutationCount: number;
    warnings: readonly string[];
    selectorMisses: readonly {
        selector: EmailMutationSelector;
        message: string;
    }[];
    validation: "pending" | "passed" | "failed";
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
export interface EmailDocument {
    readonly theme: EmailThemeApi;
    byId(id: string, disambiguateBy?: DisambiguateBy): EmailNode;
    select(selector: EmailMutationSelector): EmailNode[];
    first(selector: EmailMutationSelector): EmailNode;
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
    insert(componentFile: string, position: InsertPosition): InsertedEmailNode;
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
}
export interface EmailSdkSession {
    email: EmailDocument;
    finish(): unknown;
    toJSON(): unknown;
    diagnostics(): EmailDiagnostics;
    readonly mutationCount: number;
}
export type EmailMutationSdkSession = EmailSdkSession;
