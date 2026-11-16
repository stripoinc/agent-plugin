import { type JsonSchemaNode } from './contract.js';
type Sides<T> = Partial<Record<'top' | 'right' | 'bottom' | 'left', T>>;
type Gradient = {
    gradientType: 'linear' | 'radial';
    angle: number;
    gradientItems: {
        position: number;
        color: string;
        opacity: number;
    }[];
};
type Color = string | null;
type BorderColor = {
    color?: Color;
};
type LayoutFields = {
    link?: {
        href: string;
        salesforce?: {
            trackingAlias: string;
            linkTo: string;
            conversion: boolean;
        };
        calendarEvent?: unknown;
    } | null;
    lock?: {
        enabled: boolean;
        options: {
            preventContentEdit: boolean;
            preventStyleEdit: boolean;
        };
    };
    smartBlock?: object | null;
};
type LayoutDark = {
    backgroundGradient?: Gradient | null;
    borderColors?: Sides<string> | null;
};
type AddedSettings = {
    stripe: LayoutFields & {
        stripeBackgroundGradient?: Gradient | null;
        contentBackgroundGradient?: Gradient | null;
        mobileContentBorder?: object | null;
        darkTheme?: {
            stripeBackgroundGradient?: Gradient | null;
            contentBackgroundGradient?: Gradient | null;
            contentBorderColors?: Sides<string> | null;
        };
    };
    structure: LayoutFields & {
        backgroundGradient?: Gradient | null;
        mobileBorder?: object | null;
        darkTheme?: LayoutDark;
    };
    image: {
        darkTheme?: {
            src?: string | null;
        };
    };
    video: {
        darkTheme?: {
            customThumbnail?: {
                src: string;
            } | null;
        };
    };
    social: {
        darkTheme?: {
            backgroundColor?: Color;
        };
    };
    spacer: {
        darkTheme?: {
            backgroundColor?: Color;
            border?: BorderColor;
        };
    };
    button: {
        darkTheme?: {
            backgroundColor?: Color;
            fontColor?: Color;
            border?: Sides<BorderColor>;
        };
    };
    menu: {
        darkTheme?: {
            backgroundColor?: Color;
            colors?: {
                link?: Color;
            };
            separator?: BorderColor;
        };
    };
    menuItem: {
        darkTheme?: {
            colors?: {
                link?: Color;
                background?: Color;
            };
        };
    };
};
export type AdditionalNodeSettings<K extends string> = K extends keyof AddedSettings ? AddedSettings[K] : {};
/** A per-operation view of reviewed SDK fields confirmed by a schema downloaded from the target server. */
export declare class ServerDocumentSchema {
    #private;
    constructor(document: unknown);
    get supportedFields(): readonly string[];
    has(kind: string, path: string): boolean;
    isAdditional(kind: string, path: string): boolean;
    node(kind: string): JsonSchemaNode;
    acceptsAcquiredField(path: readonly (string | number)[], blockType?: string): boolean;
    resolve: (node: JsonSchemaNode) => JsonSchemaNode;
}
export {};
