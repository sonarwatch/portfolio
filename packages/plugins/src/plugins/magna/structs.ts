import {
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob } from '../../utils/solana';

export type AirdropProof = {
  discriminator: number[];
  offset: Buffer;
  user: PublicKey;
  padding: Buffer;
};

export const airdropProofStruct = new FixableBeetStruct<AirdropProof>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['offset', blob(77)],
    ['user', publicKey],
    ['padding', blob(10)],
  ],
  (args) => args as AirdropProof
);
