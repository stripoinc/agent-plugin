import { type JsonObject } from "./model-utils.js";
type NodeKind = "stripes" | "structures" | "columns" | "containers" | "blocks";
interface EditorSummary {
    shape: {
        hasSettings: boolean;
        hasStripes: boolean;
        hasCompiledHtml: boolean;
        hasCompiledCss: boolean;
    };
    metadata: JsonObject;
    theme: Record<string, unknown>;
    counts: Record<NodeKind | "moduleNodes", number>;
    ids: Record<NodeKind, (string | undefined)[]> & {
        duplicateIds: {
            id: string;
            count: number;
        }[];
    };
    blockTypes: Record<string, number>;
    blockVisibility: Record<string, number>;
    inventories: Record<"text" | "buttons" | "images" | "menus" | "social", JsonObject[]>;
    limitations: {
        lockedBlocks: JsonObject[];
    };
}
export declare function summarizeEditorJson(value: unknown): EditorSummary;
export {};
