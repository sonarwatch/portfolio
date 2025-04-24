import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'parcl';
const mainContract = {
  name: 'Liquidity & Trading',
  address: '3parcLrT7WnXAcyPfkCz49oofuuf2guUKkjuFkAhZW8Y',
  platformId,
};
const stakingContract = {
  name: 'Parcl Staking',
  address: '2gWf5xLAzZaKX9tQj9vuXsaxTWtzTZDFRn21J3zjNVgu',
  platformId,
};
const airdropContract = {
  name: 'Airdrop',
  address: '5tu3xkmLfud5BAwSuQke4WSjoHcQ52SbrPwX9es8j6Ve',
  platformId,
};

export const services: ServiceDefinition[] = [
  {
    id: `${platformId}-main`,
    name: 'Liquidity & Trading',
    platformId,
    networkId: NetworkId.solana,
    contracts: [mainContract],
  },
  {
    id: `${platformId}-staking`,
    name: 'Staking',
    platformId,
    networkId: NetworkId.solana,
    contracts: [stakingContract],
  },
  {
    id: `${platformId}-airdrop`,
    name: 'Airdrop',
    platformId,
    networkId: NetworkId.solana,
    contracts: [airdropContract],
  },
];
export default services;
