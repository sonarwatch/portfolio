import { PublicKey } from '@solana/web3.js';
import { farmProgramId } from './constants';
import { Farm } from './struct';
import { FormattedFarm } from './types';
import { ParsedAccount } from '../../utils/solana';

export function getStakingAccounts(
  owner: string,
  farms: string[]
): PublicKey[] {
  return farms.map(
    (farm) =>
      PublicKey.findProgramAddressSync(
        [new PublicKey(owner).toBuffer(), new PublicKey(farm).toBuffer()],
        farmProgramId
      )[0]
  );
}

export function formatFarm(farm: ParsedAccount<Farm>): FormattedFarm {
  return {
    pubkey: farm.pubkey.toString(),
    authority: farm.authority.toString(),
    stakingMint: farm.stakingMint.toString(),
    stakingVault: farm.stakingVault.toString(),
    rewardAMint: farm.rewardAMint.toString(),
    rewardAVault: farm.rewardAVault.toString(),
    rewardBMint: farm.rewardBMint.toString(),
    rewardBVault: farm.rewardBVault.toString(),
    rewardDuration: farm.rewardDuration.toString(),
    rewardDurationEnd: farm.rewardDurationEnd.toString(),
    lastUpdateTime: farm.lastUpdateTime.toString(),
    rewardARate: farm.rewardARate.toString(),
    rewardBRate: farm.rewardBRate.toString(),
    rewardAPerTokenStored: farm.rewardAPerTokenStored.toString(),
    rewardBPerTokenStored: farm.rewardBPerTokenStored.toString(),
    rewardARateU128: farm.rewardARateU128.toString(),
    rewardBRateU128: farm.rewardBRateU128.toString(),
    paused: farm.paused,
    totalStaked: farm.totalStaked.toString(),
  };
}
