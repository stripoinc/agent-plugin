import { type DocumentState } from './contract.js';
import { type ChangeIntent } from './lost-keys.js';
import type { ServerDocumentSchema } from './server-schema.js';
export type { ChangeIntent } from './lost-keys.js';
export interface DocumentIssue {
    code: string;
    stage: 'json' | 'schema' | 'change' | 'preservation' | 'runtime';
    input: 'current' | 'target';
    path: string;
    message: string;
    nodeId?: string;
    nodeType?: string;
    operation?: number;
    transaction?: number;
    nativeCode?: string;
    reason?: string;
    details?: unknown;
}
export interface DocumentCompatibility {
    preservedCount: number;
    preservedPaths: readonly string[];
}
export type ValidationResult = {
    success: true;
    documentState: DocumentState;
    normalizations: readonly string[];
    issues: readonly [];
    verification: 'contract';
    compatibility?: DocumentCompatibility;
} | {
    success: false;
    issues: readonly DocumentIssue[];
};
export declare class DocumentStateError extends Error {
    readonly issues: readonly DocumentIssue[];
    readonly code: string;
    readonly stage: DocumentIssue['stage'] | undefined;
    readonly input: DocumentIssue['input'] | undefined;
    readonly path: string | undefined;
    constructor(issues: readonly DocumentIssue[]);
}
export declare function jsonIssues(value: unknown, input?: 'current' | 'target'): DocumentIssue[];
/** Shared traversal for strict unknown-key diagnostics and acquired-document projection. */
export declare function visitDocumentFields(value: unknown, visitField: (parent: Record<string, unknown>, path: readonly (string | number)[], known: boolean) => void, serverSchema?: ServerDocumentSchema): void;
export declare function isLegacyStructureLayout(path: readonly (string | number)[]): boolean;
/**
 * Validate a complete acquired Document State snapshot against the pinned native contract.
 * unknown is a boundary type, not permission for partial/non-JSON data; no creation defaults are added.
 */
export declare function validateSnapshot(document: unknown, serverSchema?: ServerDocumentSchema): ValidationResult;
/**
 * Validate a complete target against its acquired current snapshot, including preservation and operation support.
 * Omit current only for creation; intent names exact intentional losses and cannot bypass native restrictions.
 * Success returns normalized Document State and contract evidence, not proof of remote persistence or visual fidelity.
 */
export declare function validateChange({ current, target, intent, serverSchema }: {
    current?: unknown;
    target: unknown;
    intent?: ChangeIntent;
    serverSchema?: ServerDocumentSchema;
}): ValidationResult;
export declare function requireValid(result: ValidationResult): DocumentState;
