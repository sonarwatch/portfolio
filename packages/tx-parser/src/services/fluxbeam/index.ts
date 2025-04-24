import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'fluxbeam';
const contract = {
  name: 'Pool',
  address: 'FLUXubRmkEi2q6K3Y9kBPg9248ggaZVsoSFhtJHSrm1X',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-pool`,
  name: 'Pool',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
