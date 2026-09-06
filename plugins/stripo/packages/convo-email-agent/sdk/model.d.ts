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
};
export interface SchemaValidationError {
    readonly instancePath: string;
    readonly keyword: string;
    readonly message?: string;
    readonly params: Record<string, unknown>;
    readonly schemaPath: string;
}
/** Initialize validation with the schema downloaded from the configured email service. */
export declare function setEmailSchema(schema: unknown): void;
/** Validate native JSON with the loaded schema without opening an editing session. */
export declare function assertValidEmailModel(value: unknown): asserts value is JsonObject;
export declare class EmailSdkSchemaError extends Error {
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
    private readonly validate;
    private readonly draft;
    private readonly idFactory;
    private readonly lastCloneBySource;
    private readonly lastInsertByAnchor;
    constructor(templateJson: unknown, idFactory?: () => string);
    beginTransaction(): MutationTransaction;
    rollback(transaction: MutationTransaction): this;
    validateDraft(context: string, details?: SchemaValidationDetails): this;
    getContent(id: string): string | undefined;
    setContent(id: string, property: string, value: JsonValue): this;
    setElementProperty(id: string, property: string, value: JsonValue): this;
    setDocumentPath(path: readonly string[], value: JsonValue, merge?: boolean): this;
    cloneElement(id: string, newId: string, isBefore?: boolean, nestedIds?: NestedIdsMap): this;
    insertNode(node: unknown, anchorId: string, isBefore?: boolean, nestedIds?: NestedIdsMap): this;
    deleteElement(id: string): this;
    deleteElementIfPresent(id: string): this;
    hasElement(id: string): boolean;
    collectSubtreeIds(id: string): string[];
    describeElement(id: string): ElementDescription | undefined;
    apply(): JsonObject;
    snapshot(): JsonObject;
}
export {};
