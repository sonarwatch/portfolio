import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { orePid } from './constants';
import { Config, ParsedBoost, Proof, Stake } from './structs';
import { ParsedAccount } from '../../utils/solana';

export function getStakePdas(owner: string, boosts: string[]): PublicKey[] {
  return boosts.map(
    (boost) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('stake', 'utf-8'),
          new PublicKey(owner).toBuffer(),
          new PublicKey(boost).toBuffer(),
        ],
        orePid
      )[0]
  );
}

export function getProofPda(authority: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('proof', 'utf-8'), authority.toBuffer()],
    new PublicKey('oreV2ZymfyeXgNgBdqMkumTqqAprVqgBWQfoYkrtKWQ')
  )[0];
}

export function getProofPdas(boosts: string[]): PublicKey[] {
  return boosts.map((boost) => getProofPda(new PublicKey(boost)));
}

// from : https://github.com/regolith-labs/ore-app/blob/4c56f0ed204373f0b47bf153ae156d3d892021f5/src/hooks/use_claimable_yield.rs#L32
export function getClaimableRewards(
  boost: ParsedBoost,
  stake: ParsedAccount<Stake>,
  boostConfig: Config,
  proof: ParsedAccount<Proof>
) {
  // rewards
  let { rewards } = stake;
  let configRewardsFactor = new BigNumber(boostConfig.rewardsFactor);
  let boostRewardsFactor = new BigNumber(boost.rewardsFactor);

  // Add boost proof balance to config rewards factor if available
  if (proof.balance.isGreaterThan(0)) {
    const fractionReward = proof.balance.dividedBy(boostConfig.totalWeight);
    configRewardsFactor = configRewardsFactor.plus(fractionReward);
  }

  // Calculate boost rewards if config factor increased
  if (configRewardsFactor.isGreaterThan(boost.lastRewardsFactor)) {
    const accumulatedRewards = configRewardsFactor.minus(
      boost.lastRewardsFactor
    );
    const boostRewards = accumulatedRewards.multipliedBy(boost.weight);
    const boostRewardsIncrease = boostRewards.dividedBy(boost.totalDeposits);
    boostRewardsFactor = boostRewardsFactor.plus(boostRewardsIncrease);
  }

  // Calculate personal rewards if boost factor increased
  if (boostRewardsFactor.isGreaterThan(stake.lastRewardsFactor)) {
    const accumulatedRewards = boostRewardsFactor.minus(
      stake.lastRewardsFactor
    );
    const personalRewards = accumulatedRewards.multipliedBy(stake.balance);
    rewards = rewards.plus(personalRewards);
  }

  return rewards;
}
