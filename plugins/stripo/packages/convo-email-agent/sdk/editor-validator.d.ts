/** One validation failure, addressed the way set_document_state reports it: a dot path. */
export interface EmailValidationIssue {
    /** Dot path into the document (array indexes as numbers); `<root>` for the document itself. */
    readonly path: string;
    /** zod issue code (`invalid_type`, `unrecognized_keys`, `invalid_value`, `custom`, …) or `editor_rule`. */
    readonly code: string;
    readonly message: string;
}
export interface EmailValidationOptions {
    /**
     * The document state the write would replace (the acquired model). Rules that depend on the
     * current state — duplicate IDs, metadata length limits for unchanged text, the alignment lock
     * of full-width media — see an empty document when it is omitted.
     */
    readonly current?: unknown;
}
export declare const ROOT_PATH = "<root>";
/** `/stripes/0/blocks` → `stripes.0.blocks`; `` → `<root>`. */
export declare function pointerToPath(pointer: string): string;
/**
 * Schema issues for `model`, or an empty list. Runs the bundled editor's
 * zod schema (with the defaults the server fills in first) and the SDK's social-block rules.
 */
export declare function validateEmailDocument(model: unknown, options?: EmailValidationOptions): EmailValidationIssue[];
