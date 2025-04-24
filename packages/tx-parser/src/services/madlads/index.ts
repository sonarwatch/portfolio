import { NetworkId } from '@sonarwatch/portfolio-core';
import { vestingContract } from '../streamflow';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'madlads';
const solboundContract = {
  name: 'SolBound',
  address: '7DkjPwuKxvz6Viiawtbmb4CqnMKP6eGb1WqYas1airUS',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-launch`,
  name: 'W Claim',
  platformId,
  networkId: NetworkId.solana,
  contracts: [solboundContract, vestingContract],
};

export const services: ServiceDefinition[] = [service];
export default services;
