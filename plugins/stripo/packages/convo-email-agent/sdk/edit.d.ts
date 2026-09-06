import type { CreateEmailSdkOptions, EmailSdkSession, EmailMutationSdkSession } from "./types.js";
export type * from "./types.js";
export { EmailSdkError } from "./errors.js";
export { describeNodeKind } from "./model-utils.js";
export { EmailSdkSchemaError } from "./model.js";
export declare function createEmailSdk(options: CreateEmailSdkOptions): EmailSdkSession;
export declare function createEmailMutationSdk(options: CreateEmailSdkOptions): EmailMutationSdkSession;
