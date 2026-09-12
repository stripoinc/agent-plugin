export declare function isSupportedThemeReset(pointer: string, before: unknown): boolean;
/** Exact addresses, not a global "allow losses" switch. Node fields use /<id>/settings/… . */
export interface ChangeIntent {
    removeNodes?: readonly string[];
    resetFields?: readonly string[];
    replaceCollections?: readonly string[];
}
export declare function findUnintendedLosses(input: unknown, output: unknown, intent?: ChangeIntent): string[];
