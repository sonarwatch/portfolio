import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'adrena';
const contract = {
  name: 'Adrena',
  address: '13gDzEXCdocbj8iAiqrScGo47NiSuYENGsRqi3SEAwet',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}`,
  name: 'Adrena',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [service];
export default services;
