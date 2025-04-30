import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'solanart';

const mainContract = {
  name: 'Main',
  address: 'CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz',
  platformId,
};

const globalOfferContract = {
  name: 'Global Offer',
  address: '5ZfZAwP2m93waazg8DkrrVmsupeiPEvaEHowiUP7UAbJ',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-marketplace`,
  name: 'Marketplace',
  platformId,
  networkId: NetworkId.solana,
  contracts: [mainContract],
};

const globalOfferService: ServiceDefinition = {
  id: `${platformId}-global-offer`,
  name: 'Global Offer',
  platformId,
  networkId: NetworkId.solana,
  contracts: [globalOfferContract],
};

export const services: ServiceDefinition[] = [
  stakingService,
  globalOfferService,
];
export default services;
