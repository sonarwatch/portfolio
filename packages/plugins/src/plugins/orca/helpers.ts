import { TokenPrice, aprToApy } from '@sonarwatch/portfolio-core';
import { Metadata, Nft, Sft } from '@metaplex-foundation/js';
import { Aquafarm } from './structs/aquafarms';
import { positionsIdentifier } from './constants';

export function isAnOrcaPosition(nft: Metadata | Nft | Sft): boolean {
  return nft && nft.name === positionsIdentifier;
}

export function getYields(
  aquafarm: Aquafarm,
  rewardToken: TokenPrice,
  baseVaultValue: number
) {
  const apr = aquafarm.emissionsPerSecondNumerator
    .div(aquafarm.emissionsPerSecondDenominator)
    .div(10 ** rewardToken.decimals)
    .times(60 * 60 * 24 * 365)
    .times(rewardToken.price)
    .div(baseVaultValue)
    .times(100)
    .toNumber();
  const yields = [
    {
      mint: rewardToken.address,
      apr,
      apy: aprToApy(apr),
    },
  ];
  return yields;
}
