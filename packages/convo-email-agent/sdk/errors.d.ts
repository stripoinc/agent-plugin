export declare const LINE_HEIGHT_HINT = "lineHeight uses a unitless multiplier from 0 to 5 with at most two decimal places; use 1.5 for 150%.";
export declare class EmailSdkError extends Error {
    readonly code = "INVALID_OPERATION";
    readonly stage = "change";
    readonly input = "target";
    readonly path = "<root>";
    constructor(message: string);
}
