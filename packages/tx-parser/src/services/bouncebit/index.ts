import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'bouncebit';

const contract = {
  name: 'CeDeFi v2',
  address: '65YBWQitcBexwuaBKfAV163xDd4LzVAdytATLbttpgxx',
  platformId,
};

const rewardsContract = {
  name: 'Rewards',
  address: '5DBxQ4KRKgpCEp46fSs2RG4uoZ5totahCLyjmnn6tKRg',
  platformId,
};

const promoContract = {
  name: 'Promo',
  address: '5HRzz8VDD9QjpEBBdq6hBUEXcssxW5mPnod4L6Qgnh9g',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-cedefi-v2`,
  name: 'CeDeFi',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const rewardsService: ServiceDefinition = {
  id: `${platformId}-cedefi`,
  name: 'Rewards',
  platformId,
  networkId: NetworkId.solana,
  contracts: [rewardsContract],
};

const promoService: ServiceDefinition = {
  id: `${platformId}-promo`,
  name: 'Promo',
  platformId,
  networkId: NetworkId.solana,
  contracts: [promoContract],
};

export const services: ServiceDefinition[] = [
  service,
  rewardsService,
  promoService,
];
export default services;
