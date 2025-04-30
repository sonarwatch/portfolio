import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'stepfinance';
const stakingContract = {
  name: 'Staking',
  address: 'Stk5NCWomVN3itaFjLu382u9ibb5jMSHEsh6CuhaGjB',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

export const services: ServiceDefinition[] = [service];
export default services;
