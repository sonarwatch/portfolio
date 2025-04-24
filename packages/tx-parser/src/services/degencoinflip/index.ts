import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'degencoinflip';
const contract = {
  name: 'Coinflip',
  address: 'BmjJ85zsP2xHPesBKpmHYKt136gzeTtNbeVDcdfybHHT',
  platformId,
};

const service: Service = {
  id: `${platformId}-coinflip`,
  name: 'Coinflip',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
