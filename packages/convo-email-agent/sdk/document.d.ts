import { type BlockKind, type DocumentBlock, type DocumentState } from './contract.js';
import type { CreateEmailSdkOptions, DeepPatch, EmailSdkSession, IdFactory } from './types.js';
import type { BlockOf, NativeStructure, NativeStripe } from './generated/document-state.js';
export interface OpenDocumentOptions extends Omit<CreateEmailSdkOptions, 'emailJson'> {
    current: unknown;
}
export declare function openDocument(options: OpenDocumentOptions): EmailSdkSession;
export interface CreateDocumentOptions extends OpenDocumentOptions {
    /** Native new content. Metadata, resources and settings are preserved from current. */
    stripes?: DocumentState['stripes'];
}
export declare function createDocument({ current, stripes, ...options }: CreateDocumentOptions): EmailSdkSession;
/** Native factory. Supply required content; canonical defaults fill only settings. */
export declare function createBlock<K extends BlockKind>(type: K, input: Omit<BlockOf<K>, 'type' | 'settings'> & {
    settings?: DeepPatch<BlockOf<K>['settings']>;
}): BlockOf<K>;
export interface StructureInput {
    id: string;
    columns: Array<{
        id: string;
        weight: number;
        containers: Array<{
            id: string;
            blocks: DocumentBlock[];
        }>;
    }>;
    mobile?: boolean;
    settings?: Partial<NativeStructure['settings']>;
}
export declare function createStripe(input: {
    id: string;
    structures: NativeStructure[];
    settings?: DeepPatch<NativeStripe['settings']>;
}): NativeStripe;
export declare function createStructure(input: StructureInput, options?: {
    idFactory?: IdFactory;
}): NativeStructure;
