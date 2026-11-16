import type { DocumentState } from './contract.js';
import { type DocumentCompatibility, type DocumentIssue } from './preparation.js';
import { type NodeIndexEntry } from './selectors.js';
import type { ServerDocumentSchema } from './server-schema.js';
type Path = readonly (string | number)[];
interface PreservedField {
    path: Path;
    kind: 'unknown' | 'gradient';
}
export interface AcquiredDocumentProjection {
    original: unknown;
    working: unknown;
    fields: readonly PreservedField[];
}
export declare function projectAcquiredDocument(input: unknown, serverSchema?: ServerDocumentSchema): AcquiredDocumentProjection;
/** Preserve original JSON values while applying the changes the pinned contract validated. */
export declare function trackAcquiredFields(projection: AcquiredDocumentProjection, references: {
    reference(path: Path): string;
    referencePath(token: string): Path | undefined;
}, serverSchema?: ServerDocumentSchema): {
    summary: DocumentCompatibility;
    check: (target: unknown, locations?: {
        sourceToTarget: Map<NodeIndexEntry, NodeIndexEntry>;
        targetToSource: Map<string, NodeIndexEntry>;
        structuralArrays: Set<string>;
    }) => DocumentIssue[];
    draft(target: unknown): DocumentState;
    complete(target: DocumentState): {
        documentState: DocumentState;
    } | {
        issues: DocumentIssue[];
    };
    assertCanCopy(target: unknown, path: Path): void;
    assertCanWrite(target: unknown, path: Path, relativePath: Path): void;
};
export {};
