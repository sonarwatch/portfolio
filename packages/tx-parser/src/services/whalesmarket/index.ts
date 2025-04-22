import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'whalesmarket';
const contract = {
  name: 'Prediction Market',
  address: 'stPdYNaJNsV3ytS9Xtx4GXXXRcVqVS6x66ZFa26K39S',
  platformId,
};

const service: Service = {
  id: `${platformId}-prediction-market`,
  name: 'Prediction Market',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
