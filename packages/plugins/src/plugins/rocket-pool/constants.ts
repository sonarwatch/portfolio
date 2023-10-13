import { Platform, ethereumNetwork } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

export const platformId = 'rocketpool';
export const fooPlatform: Platform = {
  id: platformId,
  name: 'Rocket Pool',
  defiLlamaId: 'rocket-pool',
  image: 'https://sonar.watch/img/platforms/rocketpool.png',
};
export const marketsCachePrefix = `${platformId}-markets`;
export const minipoolManagerAddress =
  '0x6293b8abc1f36afb22406be5f96d893072a8cf3a';
export const nodeStakingAddress = '0x0d8D8f8541B12A0e1194B7CC4b6D954b90AB82ec';
export const rplAddress = '0xd33526068d116ce69f19a9ee46f0bd304f21a51f';
export const rplDecimals = 18;
export const ethFactor = new BigNumber(10 ** ethereumNetwork.native.decimals);
export const rplFactor = new BigNumber(10 ** rplDecimals);
