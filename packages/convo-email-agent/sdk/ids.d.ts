import type { IdFactory } from "./types.js";
export declare function uuidFromSeed(seed: string): string;
/**
 * The ID of a node the SDK creates. The service applies writes from sessions started from one
 * document as deltas, so their new nodes must never share IDs; seed-derived IDs repeat across
 * sessions and the SDK reads no global objects, so every new node needs the host's random idFactory.
 */
export declare function issueNodeId(idFactory: IdFactory | undefined, seed: string, isTaken: (id: string) => boolean): string;
export declare function uniqueUuidFromSeed(seed: string, isTaken: (id: string) => boolean): string;
