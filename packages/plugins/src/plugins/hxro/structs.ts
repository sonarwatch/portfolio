import { BeetStruct, bool } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type StakeRewardsState = {
  effectiveAmountStaked: BigNumber;
  amountStaked: BigNumber;
  claimedShares: BigNumber;
};

export const stakeRewardsStateStruct = new BeetStruct<StakeRewardsState>(
  [
    ['effectiveAmountStaked', u128],
    ['amountStaked', u64],
    ['claimedShares', u128],
  ],
  (args) => args as StakeRewardsState
);

export type StakingRewards = {
  buffer: Buffer;
  staker: PublicKey;
  stakepool: PublicKey;
  poolShares: PublicKey;
  stakerShares: PublicKey;
  vaultNeedsMultisig: boolean;
  depositTimestamp: BigNumber;
  stakeDuration: BigNumber;
  lastClaimTimestamp: BigNumber;
  padding: Buffer;
  stakeState: StakeRewardsState;
};

export const stakeRewardsStruct = new BeetStruct<StakingRewards>(
  [
    ['buffer', blob(8)],
    ['staker', publicKey],
    ['stakepool', publicKey],
    ['poolShares', publicKey],
    ['stakerShares', publicKey],
    ['vaultNeedsMultisig', bool],
    ['depositTimestamp', i64],
    ['stakeDuration', u64],
    ['lastClaimTimestamp', i64],
    ['padding', blob(1)],
    ['stakeState', stakeRewardsStateStruct],
  ],
  (args) => args as StakingRewards
);

export type ClaimableRewards = {
  buffer: Buffer;
  staker: PublicKey;
  stakepool: PublicKey;
  poolShares: PublicKey;
  stakerShares: PublicKey;
  vaultNeedsMultisig: boolean;
  depositTimestamp: BigNumber;
  stakeDuration: BigNumber;
  lastClaimTimestamp: BigNumber;
  claimableShares: BigNumber;
};

export const claimableRewardsStruct = new BeetStruct<ClaimableRewards>(
  [
    ['buffer', blob(8)],
    ['staker', publicKey],
    ['stakepool', publicKey],
    ['poolShares', publicKey],
    ['stakerShares', publicKey],
    ['depositTimestamp', i64],
    ['stakeDuration', u64],
    ['lastClaimTimestamp', u64],
    ['claimableShares', u64],
  ],
  (args) => args as ClaimableRewards
);
