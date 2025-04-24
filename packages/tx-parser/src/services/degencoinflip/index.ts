import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'degencoinflip';
const contract = {
  name: 'Coinflip',
  address: 'BmjJ85zsP2xHPesBKpmHYKt136gzeTtNbeVDcdfybHHT',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-coinflip`,
  name: 'Coinflip',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
