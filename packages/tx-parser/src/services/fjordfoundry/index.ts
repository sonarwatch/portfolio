import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'fjordfoundry';
const contract = {
  name: 'Bootstrap',
  address: 'w4cy1r9U7ag99RfBjb3Mz69oiANFeQystgQXerwUWLM',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-bootstrap`,
  name: 'Bootstrap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
