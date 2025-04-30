import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'cyberfrogs';

const autoThorContract = {
  name: 'AutoThor',
  address: '8F2VM13kdMBaHtcXPHmArtLueg7rfsa3gnrgGjAy4oCu',
  platformId,
};

const autoThorService: ServiceDefinition = {
  id: `${platformId}-autothor`,
  name: 'AutoThor',
  platformId,
  networkId: NetworkId.solana,
  contracts: [autoThorContract],
};

export const services: ServiceDefinition[] = [autoThorService];
export default services;
