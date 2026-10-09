export declare const LINE_HEIGHT_HINT = "lineHeight uses a finite, unitless multiplier between 0 and 5; use 1.5 for 150%.";
export declare class EmailSdkError extends Error {
    readonly code = "INVALID_OPERATION";
    readonly stage = "change";
    readonly input = "target";
    readonly path = "<root>";
    constructor(message: string);
}
