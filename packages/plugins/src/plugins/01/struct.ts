import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { blob } from '../../utils/solana';
import { WrappedI80F48, wrappedI80F48Struct } from '../marginfi/structs/common';

export type Margin = {
  buffer: Buffer;
  nonce: number;
  authority: PublicKey;
  collateral: WrappedI80F48[];
  control: PublicKey;
  padding: Buffer;
};

export const marginStruct = new BeetStruct<Margin>(
  [
    ['buffer', blob(8)],
    ['nonce', u8],
    ['authority', publicKey],
    ['collateral', uniformFixedSizeArray(wrappedI80F48Struct, 25)],
    ['control', publicKey],
    ['padding', blob(320)],
  ],
  (args) => args as Margin
);
