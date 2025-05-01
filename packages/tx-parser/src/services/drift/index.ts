import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'drift';
const contract = {
  name: 'Drift',
  address: 'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH',
  platformId,
};

const proxyContract = {
  name: 'Jit Proxy',
  address: 'J1TnP8zvVxbtF5KFp5xRmWuvG9McnhzmBd9XGfCyuxFP',
  platformId,
};

const perpsService: ServiceDefinition = {
  id: `${platformId}-perps`,
  name: 'Perps',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const marketMakerService: ServiceDefinition = {
  id: `${platformId}-market-maker`,
  name: 'Market Maker',
  platformId,
  networkId: NetworkId.solana,
  contracts: [proxyContract],
};

export const services: ServiceDefinition[] = [perpsService, marketMakerService];
export default services;
