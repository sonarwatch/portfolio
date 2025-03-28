import {
  BeetStruct,
  bool,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type VestingAccount = {
  buffer: Buffer;
  owner: PublicKey;
  lastClaimedAt: BigNumber;
  totalAmount: BigNumber;
  amountClaimed: BigNumber;
  isCanceled: boolean;
};

export const vestingAccountStruct = new BeetStruct<VestingAccount>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['lastClaimedAt', i64],
    ['totalAmount', u64],
    ['amountClaimed', u64],
    ['isCanceled', bool],
  ],
  (args) => args as VestingAccount
);

export type StakingAccount = {
  accountDiscriminator: number[];
  owner: PublicKey;
  payer: PublicKey;
  stakePool: PublicKey;
  lockupDuration: BigNumber;
  depositTimestamp: BigNumber;
  depositAmount: BigNumber;
  effectiveStake: BigNumber;
  claimedAmounts: BigNumber[];
};

export const stakingAccountStruct = new BeetStruct<StakingAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['owner', publicKey],
    ['payer', publicKey],
    ['stakePool', publicKey],
    ['lockupDuration', u64],
    ['depositTimestamp', i64],
    ['depositAmount', u64],
    ['effectiveStake', u128],
    ['claimedAmounts', uniformFixedSizeArray(u128, 10)],
  ],
  (args) => args as StakingAccount
);
