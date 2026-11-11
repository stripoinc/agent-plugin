import type { CreateEmailSdkOptions, EmailSdkSession, EmailMutationSdkSession, IdFactory } from "./types.js";
export type * from "./types.js";
export { EmailSdkError } from "./errors.js";
export { describeNodeKind } from "./model-utils.js";
export { EmailSdkSchemaError } from "./model.js";
export declare function createEmailSdk(options: CreateEmailSdkOptions): EmailSdkSession;
/**
 * A mutation session whose type requires idFactory, so a TypeScript host cannot forget the random
 * source its new nodes need. At runtime it is createEmailSdk: only the first new node checks it.
 */
export declare function createEmailMutationSdk(options: CreateEmailSdkOptions & {
    idFactory: IdFactory;
}): EmailMutationSdkSession;
