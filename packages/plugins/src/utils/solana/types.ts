import { BeetStruct, FixableBeetStruct } from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';

export type ParsedAccount<T> = T & {
  pubkey: PublicKey;
  lamports: number;
};

export type GlobalBeetStruct<T> =
  | BeetStruct<T, Partial<T>>
  | FixableBeetStruct<T, Partial<T>>;
