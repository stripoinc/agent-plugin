import { type EmailValidationIssue, type EmailValidationOptions } from "./editor-validator.js";
import { type ChangeIntent } from './preparation.js';
type JsonArray = JsonValue[];
type JsonObject = {
    [key: string]: JsonValue;
};
type JsonValue = boolean | JsonArray | JsonObject | null | number | string;
type NestedIdsMap = Record<string, string>;
export type SchemaValidationDetails = {
    operation?: "insert";
    componentFile?: string;
    direction?: "after" | "before";
    anchorLabel?: string;
    componentKind?: string;
    anchorKind?: string;
    rolledBack?: boolean;
};
type MutationTransaction = {
    draft: JsonObject;
    lastCloneBySource: Map<string, string>;
    lastInsertByAnchor: Map<string, string>;
    references: Map<string, Array<string | number>>;
};
/** One rejection, addressed the way set_document_state reports it (dot path, `<root>` for the document). */
export type SchemaValidationError = EmailValidationIssue;
/**
 * @deprecated Validation uses the bundled editor rules. Retained for existing hosts; the
 * supplied JSON schema does not configure or disable validation.
 */
export declare function setEmailSchema(schema: unknown): void;
/** Validate native JSON with the bundled editor rules without opening an editing session. */
export declare function assertValidEmailModel(value: unknown, options?: EmailValidationOptions): asserts value is JsonObject;
export declare class EmailSdkSchemaError extends Error {
    readonly code = "INVALID_DOCUMENT";
    readonly stage = "schema";
    readonly errors: SchemaValidationError[] | null | undefined;
    readonly context: string;
    readonly details: SchemaValidationDetails | undefined;
    constructor(context: string, errors: SchemaValidationError[] | null | undefined, details?: SchemaValidationDetails);
}
export declare class EditorJsonMutationError extends Error {
    constructor(message: string);
}
export interface ElementDescription {
    kind: "block" | "container" | "column" | "structure" | "stripe";
    type?: string;
}
export declare class EditorJsonMutationCore {
    private readonly draft;
    private readonly references;
    private referenceOrdinal;
    private find;
    reference(path: readonly (string | number)[]): string;
    referencePath(token: string): Array<string | number> | undefined;
    private readonly current;
    private readonly idFactory;
    private readonly lastCloneBySource;
    private readonly lastInsertByAnchor;
    constructor(templateJson: unknown, idFactory?: () => string, options?: EmailValidationOptions);
    beginTransaction(): MutationTransaction;
    rollback(transaction: MutationTransaction): this;
    validateDraft(context: string, details?: SchemaValidationDetails): this;
    getContent(id: string): string | undefined;
    setContent(id: string, property: string, value: JsonValue): this;
    setElementProperty(id: string, property: string, value: JsonValue): this;
    deleteElementProperty(id: string, path: readonly string[]): this;
    deleteDocumentPath(path: readonly string[]): this;
    moveElement(id: string, anchorId: string, before?: boolean): this;
    appendNode(node: JsonObject, parentId?: string): this;
    setDocumentPath(path: readonly string[], value: JsonValue, merge?: boolean): this;
    cloneElement(id: string, newId: string, isBefore?: boolean, nestedIds?: NestedIdsMap): this;
    insertNode(node: unknown, anchorId: string, isBefore?: boolean, nestedIds?: NestedIdsMap): this;
    deleteElement(id: string): this;
    deleteElementIfPresent(id: string): this;
    hasElement(id: string): boolean;
    collectSubtreeIds(id: string): string[];
    describeElement(id: string): ElementDescription | undefined;
    apply(intent?: ChangeIntent): JsonObject;
    snapshot(): JsonObject;
}
export {};
