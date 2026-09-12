import { type JsonObject } from "./model-utils.js";
import type { EffectiveVisibility } from "./types.js";
export type NodeKind = "stripe" | "structure" | "column" | "container" | "block";
export type MessageArea = "header" | "content" | "footer" | "infoArea" | string;
export interface NodeIndexEntry {
    id: string;
    kind: NodeKind;
    blockType?: string;
    messageArea?: MessageArea;
    ownHideElement?: "no" | "mobile" | "desktop";
    effectiveVisibility: EffectiveVisibility;
    moduleId?: string | number;
    parentChain: string[];
    /** Structural address; IDs may legitimately be shared by projections. */
    path: Array<string | number>;
    element: JsonObject;
}
export declare const LIST_KEY_KIND: Record<string, NodeKind>;
export declare function collectNodeIndex(value: unknown): NodeIndexEntry[];
export declare function hasLink(element: JsonObject, blockType?: string): boolean;
export declare function linkHostContains(element: JsonObject, blockType: string | undefined, needle: string): boolean;
