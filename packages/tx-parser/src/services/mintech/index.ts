import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'mintech';
const contract = {
  name: 'Router',
  address: 'minTcHYRLVPubRK8nt6sqe2ZpWrGDLQoNLipDJCGocY',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-bot`,
  name: 'Bot',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
