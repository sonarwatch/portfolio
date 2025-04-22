import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'fluxbeam';
const contract = {
  name: 'Pool',
  address: 'FLUXubRmkEi2q6K3Y9kBPg9248ggaZVsoSFhtJHSrm1X',
  platformId,
};

const service: Service = {
  id: `${platformId}-pool`,
  name: 'Pool',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [service];
export default services;
