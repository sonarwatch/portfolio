import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'hylo';

const exchangeContract = {
  name: 'Exchange',
  address: 'HYEXCHtHkBagdStcJCp3xbbb9B7sdMdWXFNj6mdsG4hn',
  platformId,
};

const stabilityPoolContract = {
  name: 'Stability Pool',
  address: 'HysTabVUfmQBFcmzu1ctRd1Y1fxd66RBpboy1bmtDSQQ',
  platformId,
};

const exchangeService: Service = {
  id: `${platformId}-exchange`,
  name: 'Exchange',
  platformId,
  networkId: NetworkId.solana,
  contracts: [exchangeContract],
};

const stabilityPoolService: Service = {
  id: `${platformId}-stability-pool`,
  name: 'Stability Pool',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stabilityPoolContract],
};

export const services: Service[] = [exchangeService, stabilityPoolService];
export default services;
