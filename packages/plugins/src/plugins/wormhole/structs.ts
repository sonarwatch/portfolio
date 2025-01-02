import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { BeetStruct, bool, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

export type TokenBalance = {
  buffer: Buffer;
  init: boolean;
  bump: number;
  balance: BigNumber;
  rentPayer: PublicKey;
};

export const tokenBalanceStruct = new BeetStruct<TokenBalance>(
  [
    ['buffer', blob(8)],
    ['init', bool],
    ['bump', u8],
    ['balance', u64],
    ['rentPayer', publicKey],
  ],
  (args) => args as TokenBalance
);
