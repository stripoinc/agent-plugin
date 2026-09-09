export type JsonObject = Record<string, unknown>;
export declare function isObject(value: unknown): value is JsonObject;
export declare function describeNodeKind(value: unknown): "stripe" | "structure" | "column" | "container" | "block" | undefined;
export declare function collectNodeIds(value: unknown, ids?: string[]): string[];
export declare function resolveJsonPointer(root: unknown, pointer: string): unknown;
export declare function sealHandle<T extends object>(members: T): T;
export declare function cloneJson<T>(value: T): T;
export declare function collectAllIds(value: unknown, ids?: string[]): string[];
export declare function setNested(root: JsonObject, path: readonly string[], value: unknown): JsonObject;
export declare function readNested(root: JsonObject, path: readonly string[]): unknown;
/** Schema validation covers shape; the editor's text limits depend on the target's current values. */
export declare function assertMetadataTextLimits(metadata: unknown, baseline?: unknown): void;
export declare function rejectNullLeaves(value: unknown, path: string): void;
