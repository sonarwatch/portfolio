import {
  array,
  BeetStruct,
  FixableBeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, u64 } from '../../utils/solana';

export type SupportedToken = {
  mint: PublicKey;
  program: PublicKey;
  lock_account: PublicKey;
  locked_amount: BigNumber;
  _reserved: number[];
};

export const supportedTokenStruct = new BeetStruct<SupportedToken>(
  [
    ['mint', publicKey],
    ['program', publicKey],
    ['lock_account', publicKey],
    ['locked_amount', u64],
    ['_reserved', uniformFixedSizeArray(u8, 64)],
  ],
  (args) => args as SupportedToken
);

export type NormalizedTokenPool = {
  buffer: Buffer;
  data_version: number;
  bump: number;
  normalized_token_mint: PublicKey;
  normalized_token_program: PublicKey;
  supported_tokens: SupportedToken[];
  _reserved: number[];
};

export const normalizedTokenPoolStruct =
  new FixableBeetStruct<NormalizedTokenPool>(
    [
      ['buffer', blob(8)],
      ['data_version', u16],
      ['bump', u8],
      ['normalized_token_mint', publicKey],
      ['normalized_token_program', publicKey],
      ['supported_tokens', array(supportedTokenStruct)],
      ['_reserved', uniformFixedSizeArray(u8, 128)],
    ],
    (args) => args as NormalizedTokenPool
  );
