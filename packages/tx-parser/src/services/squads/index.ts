import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'squads';
const contract = {
  name: 'Multisig V4',
  address: 'SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-multisig`,
  name: 'Multisig',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
