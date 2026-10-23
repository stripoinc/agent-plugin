import type { BlockKind } from './generated/document-state.js';
export type { DocumentState, DocumentBlock, BlockKind, BlockOf, BlockSettings } from './generated/document-state.js';
export interface JsonSchemaNode {
    $ref?: string;
    type?: string | string[];
    const?: unknown;
    enum?: unknown[];
    properties?: Record<string, JsonSchemaNode>;
    definitions?: Record<string, JsonSchemaNode>;
    items?: JsonSchemaNode;
    required?: string[];
    readOnly?: boolean;
    oneOf?: JsonSchemaNode[];
    anyOf?: JsonSchemaNode[];
    allOf?: JsonSchemaNode[];
    additionalProperties?: boolean | JsonSchemaNode;
    [key: string]: unknown;
}
export interface ActionCapability {
    supported: boolean;
    runtimes: {
        browser: boolean;
        mergeService: boolean;
    };
    unavailableSideEffects: {
        browser: string[];
        mergeService: string[];
    };
}
export interface NodeCapability {
    schemaDefinition: string;
    nodeType: string;
    readOnlyProperties: string[];
    actions: Record<'INSERT' | 'UPDATE' | 'DELETE' | 'MOVE', ActionCapability>;
}
export declare function getContract(): Readonly<{
    editorRevision: string;
    editorDirty: boolean;
    profile: 'mergeService';
    validation: 'contract';
    validatorSha256: string;
}>;
export declare function getJsonSchema(): JsonSchemaNode;
export interface FieldSupport {
    decision: string;
    method: string;
    omission: string;
    source: string;
    scenario: string;
}
export declare function getCapabilities(): Readonly<{
    blocks: readonly BlockKind[];
    nodes: readonly NodeCapability[];
    fields: Readonly<Record<string, FieldSupport>>;
}>;
export declare function nodeCapability(kind: string): NodeCapability | undefined;
export declare function resolveSchema(node: JsonSchemaNode): JsonSchemaNode;
export declare function nodeSchema(kind: string): JsonSchemaNode;
export declare function contractDefaults(kind: BlockKind | 'container'): Record<string, unknown>;
/** Pick the actual discriminator branch before checking unknown keys or patching. */
export declare function schemaForValue(node: JsonSchemaNode, value: unknown): JsonSchemaNode;
