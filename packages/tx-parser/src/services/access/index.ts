import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'accessprotocol';
const contract = {
  name: 'Staking',
  address: '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
