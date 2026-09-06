import type { EmailDocument, EmailNode } from "./edit.js";
type StructuralMethod = "insert" | "remove" | "repeat" | "slot";
type ValueOnly<T> = T extends (...args: infer Args) => infer Result ? (...args: Args) => ValueOnly<Result> : T extends readonly (infer Item)[] ? readonly ValueOnly<Item>[] : T extends object ? {
    readonly [Key in keyof T as Key extends StructuralMethod ? never : Key]: ValueOnly<T[Key]>;
} : T;
export type EmailValueEditor = ValueOnly<EmailDocument>;
export type EmailValueNode = ValueOnly<EmailNode>;
/** Restrict every fluent handle to value edits, including handles returned by theme/style methods. */
export declare function createEmailValueEditor(email: EmailDocument): EmailValueEditor;
export {};
