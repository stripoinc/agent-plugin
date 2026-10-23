import { type DocumentState } from './contract.js';
import { type ChangeIntent } from './lost-keys.js';
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
export type ValidationResult = {
    success: true;
    documentState: DocumentState;
    normalizations: readonly string[];
    issues: readonly [];
    verification: 'contract';
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
export declare function validateSnapshot(document: unknown): ValidationResult;
export declare function validateChange({ current, target, intent }: {
    current?: unknown;
    target: unknown;
    intent?: ChangeIntent;
}): ValidationResult;
export declare function requireValid(result: ValidationResult): DocumentState;
