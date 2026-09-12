export declare class EmailSdkError extends Error {
    readonly code = "INVALID_OPERATION";
    readonly stage = "change";
    readonly input = "target";
    readonly path = "<root>";
    constructor(message: string);
}
