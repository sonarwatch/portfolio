import {
  BeetStruct,
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import { blob } from '../../../utils/solana';
import { WrappedI80F48, wrappedI80F48Struct } from './common';

export type Balance = {
  active: number;
  bankPk: PublicKey;
  ignore: number[];
  assetShares: WrappedI80F48;
  liabilityShares: WrappedI80F48;
  padding: Buffer[];
};

export const balanceStruct = new BeetStruct<Balance>(
  [
    ['active', u8],
    ['bankPk', publicKey],
    ['ignore', uniformFixedSizeArray(u8, 7)],
    ['assetShares', wrappedI80F48Struct],
    ['liabilityShares', wrappedI80F48Struct],
    ['padding', uniformFixedSizeArray(blob(8), 4)],
  ],
  (args) => args as Balance
);

export type LendingAccount = {
  balances: Balance[];
  padding: Buffer[];
};

export const lendingAccountStruct = new FixableBeetStruct<LendingAccount>(
  [
    ['balances', uniformFixedSizeArray(balanceStruct, 16)],
    ['padding', uniformFixedSizeArray(blob(8), 8)],
  ],
  (args) => args as LendingAccount
);

export type MarginfiAccount = {
  padding1: Buffer;
  group: PublicKey;
  authority: PublicKey;
  lendingAccount: LendingAccount;
  padding: Buffer[];
};

export const marginfiAccountStruct = new FixableBeetStruct<MarginfiAccount>(
  [
    ['padding1', blob(8)],
    ['group', publicKey],
    ['authority', publicKey],
    ['lendingAccount', lendingAccountStruct],
    ['padding', uniformFixedSizeArray(blob(8), 64)],
  ],
  (args) => args as MarginfiAccount
);
