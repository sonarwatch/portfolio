import {
  BeetStruct,
  bool,
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u64 } from '../../utils/solana';
import { WrappedI80F48, wrappedI80F48Struct } from '../marginfi/structs/common';

type Balance = {
  active: boolean;
  bankPk: PublicKey;
  bankAssetTag: number;
  pad0: number[];
  assetShares: WrappedI80F48;
  liabilityShares: WrappedI80F48;
  emissionsOutstanding: WrappedI80F48;
  lastUpdate: BigNumber;
  padding: BigNumber[];
};
const balanceStruct = new BeetStruct<Balance>(
  [
    ['active', bool],
    ['bankPk', publicKey],
    ['bankAssetTag', u8],
    ['pad0', uniformFixedSizeArray(u8, 6)],
    ['assetShares', wrappedI80F48Struct],
    ['liabilityShares', wrappedI80F48Struct],
    ['emissionsOutstanding', wrappedI80F48Struct],
    ['lastUpdate', u64],
    ['padding', uniformFixedSizeArray(u64, 1)],
  ],
  (args) => args as Balance
);

type LendingAccount = {
  balances: Balance[];
  padding: BigNumber[];
};

const lendingAccountStruct = new FixableBeetStruct<LendingAccount>(
  [
    ['balances', uniformFixedSizeArray(balanceStruct, 16)],
    ['padding', uniformFixedSizeArray(u64, 8)],
  ],
  (args) => args as LendingAccount
);
type ClendAccount = {
  accountDiscriminator: number[];
  group: PublicKey;
  authority: PublicKey;
  lendingAccount: LendingAccount;
  accountFlags: BigNumber;
  padding: BigNumber[];
};

export const clendAccountStruct = new FixableBeetStruct<ClendAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['group', publicKey],
    ['authority', publicKey],
    ['lendingAccount', lendingAccountStruct],
    ['accountFlags', u64],
    ['padding', uniformFixedSizeArray(u64, 63)],
  ],
  (args) => args as ClendAccount
);
