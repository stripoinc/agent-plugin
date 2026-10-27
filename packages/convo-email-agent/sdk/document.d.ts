import { type BlockKind, type DocumentBlock, type DocumentState } from './contract.js';
import type { CreateEmailSdkOptions, DeepPatch, EmailSdkSession, IdFactory } from './types.js';
import type { BlockOf, NativeStructure, NativeStripe } from './generated/document-state.js';
export interface OpenDocumentOptions extends Omit<CreateEmailSdkOptions, 'emailJson'> {
    /** Complete acquired native Document State object; validated and cloned, never mutated in place. */
    current: unknown;
}
/** Validate an acquired native snapshot and open a local edit session; all required settings must already be present. */
export declare function openDocument(options: OpenDocumentOptions): EmailSdkSession;
export interface CreateDocumentOptions extends OpenDocumentOptions {
    /** Native new content. Metadata, resources and settings are preserved from current. */
    stripes?: DocumentState['stripes'];
}
/**
 * Replace the current document's stripes locally while preserving metadata/resources/settings.
 * Omitting stripes requests an empty replacement; native deletion restrictions, including acquired timers, still apply.
 */
export declare function createDocument({ current, stripes, ...options }: CreateDocumentOptions): EmailSdkSession;
/**
 * Native block factory: supply an ID and required non-settings content; canonical defaults fill only settings.
 * Does not generate IDs or assets. Changing a type/mode variant requires that variant's complete values.
 * Rejects unknown fields and invalid blocks; insertion may impose additional runtime/side-effect restrictions.
 */
export declare function createBlock<K extends BlockKind>(type: K, input: Omit<BlockOf<K>, 'type' | 'settings'> & {
    settings?: DeepPatch<BlockOf<K>['settings']>;
}): BlockOf<K>;
export interface StructureInput {
    id: string;
    /** Column weights must be positive finite numbers; they are relative layout weights, not pixel widths. */
    columns: Array<{
        id: string;
        weight: number;
        containers: Array<{
            id: string;
            blocks: DocumentBlock[];
        }>;
    }>;
    /** Enable mobile stacking; defaults to true for multiple columns and false for a single column. */
    mobile?: boolean;
    settings?: Partial<NativeStructure['settings']>;
}
/** Complete and validate a native stripe using fixed draft defaults; does not inherit a live document's theme. */
export declare function createStripe(input: {
    id: string;
    structures: NativeStructure[];
    settings?: DeepPatch<NativeStripe['settings']>;
}): NativeStripe;
/** Complete a native structure through the draft builder. Supply positive column weights and native block content. */
export declare function createStructure(input: StructureInput, options?: {
    idFactory?: IdFactory;
}): NativeStructure;
