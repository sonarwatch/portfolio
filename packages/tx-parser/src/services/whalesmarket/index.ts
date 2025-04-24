import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'whalesmarket';
const contract = {
  name: 'Prediction Market',
  address: 'stPdYNaJNsV3ytS9Xtx4GXXXRcVqVS6x66ZFa26K39S',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-prediction-market`,
  name: 'Prediction Market',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
