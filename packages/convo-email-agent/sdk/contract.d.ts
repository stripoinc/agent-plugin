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
/** Provenance of the bundled editor contract and merge-service validator; not a live server version query. */
export declare function getContract(): Readonly<{
    editorRevision: string;
    editorDirty: boolean;
    profile: 'mergeService';
    validation: 'contract';
    validatorSha256: string;
}>;
/**
 * Detached JSON schema for the pinned Document State contract. Resolve local $ref against its definitions.
 * Some native refinements/side effects are enforced only by the bundled validator; schema inspection is not validation.
 */
export declare function getJsonSchema(): JsonSchemaNode;
export interface FieldSupport {
    decision: string;
    method: string;
    omission: string;
    source: string;
    scenario: string;
}
/**
 * Reviewed field support and native operation capabilities for the pinned contract.
 * Read fields[path] for one field; decision/method/omission explain support, not every accepted value.
 * Use getJsonSchema or node.describe for value shapes and validate the complete candidate for contextual restrictions.
 */
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
