import BigNumber from 'bignumber.js';
import { Platform, parseTypeString } from '@sonarwatch/portfolio-core';
import { MoveResource } from '../../utils/aptos';
import { MeeiroStakeData, StakeConfig, StakeInfo } from './types';

// Meeiro
export const meeiroPlatform: Platform = {
  id: 'meeiro',
  name: 'Meeiro',
  image:
    'https://sonarwatch.github.io/portfolio/assets/images/platforms/meeiro.webp',
  website: 'https://meeiro.xyz/',
  twitter: 'https://twitter.com/Meeiro_xyz',
};
const programMeeiro =
  '0x514cfb77665f99a2e4c65a5614039c66d13e00e98daf4c86305651d29fd953e5';
const prefixMeeiro = `${programMeeiro}::Staking::StakeInfo<`;
const parseResourceMeeiro = (r: MoveResource<unknown>): StakeInfo => ({
  amountBn: new BigNumber((r as MoveResource<MeeiroStakeData>).data.amount),
  tokenAddress: parseTypeString(r.type).keys?.at(0)?.type || '',
});

export const stakeConfigs: StakeConfig[] = [
  {
    platformId: meeiroPlatform.id,
    typeLabel: 'Staked',
    prefixes: [prefixMeeiro],
    parseResource: parseResourceMeeiro,
  },
];

export const stakingAptosPlatformIds = [
  ...new Set(stakeConfigs.map((c) => c.platformId)),
];

export const platformId = 'staking-aptos';
