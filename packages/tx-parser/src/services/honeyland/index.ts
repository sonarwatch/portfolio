import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'honeyland';
const contract = {
  name: 'Staking',
  address: 'F1pkXm8W1WNbRvMoZTuKftHJ92ffuzddCCSRKKvCVL7n',
  platformId,
};

const service: ServiceDefinition = {
  id: 'honeyland-staking',
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
