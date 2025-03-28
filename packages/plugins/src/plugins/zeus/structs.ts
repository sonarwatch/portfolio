import { PublicKey } from '@solana/web3.js';
import {
  BeetStruct,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { i64, u64 } from '../../utils/solana';

enum DelegationStatus {
  Activated,
  StartDelegationRemoval,
  FinalizeDelegationRemoval,
}

export type Delegation = {
  accountDiscriminator: number[];
  delegator: PublicKey;
  guardianSetting: PublicKey;
  seed: number;
  status: DelegationStatus;
  lockDays: number;
  amount: BigNumber;
  claimableAmount: BigNumber;
  claimedReward: BigNumber;
  baseRewardRate: number;
  derivedRewardRate: number;
  previousAccumulatedAmount: BigNumber;
  createdAt: BigNumber;
  startedRemovalAt: BigNumber;
  finalizedRemovalAt: BigNumber;
};

export const delegationStruct = new BeetStruct<Delegation>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['delegator', publicKey],
    ['guardianSetting', publicKey],
    ['seed', u32],
    ['status', u8],
    ['lockDays', u16],
    ['amount', u64],
    ['claimableAmount', u64],
    ['claimedReward', u64],
    ['baseRewardRate', u32],
    ['derivedRewardRate', u32],
    ['previousAccumulatedAmount', u64],
    ['createdAt', i64],
    ['startedRemovalAt', i64],
    ['finalizedRemovalAt', i64],
  ],
  (args) => args as Delegation
);
