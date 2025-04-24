import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'streamflow';
const vestingContract = {
  name: 'Vesting',
  address: 'strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m',
  platformId,
};
const stakingContract = {
  name: 'Staking',
  address: 'STAKEvGqQTtzJZH6BWDcbpzXXn2BBerPAgQ3EGLN2GH',
  platformId,
};
const airdropsContract = {
  name: 'Airdrops',
  address: 'aSTRM2NKoKxNnkmLWk9sz3k74gKBk9t7bpPrTGxMszH',
  platformId,
};
const vestingService: ServiceDefinition = {
  id: `${platformId}-vesting`,
  name: 'Vesting',
  platformId,
  networkId: NetworkId.solana,
  contracts: [vestingContract],
};
const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};
const airdropService: ServiceDefinition = {
  id: `${platformId}-airdrops`,
  name: 'Airdrops',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropsContract],
};

export const services: ServiceDefinition[] = [
  vestingService,
  stakingService,
  airdropService,
];
export default services;
