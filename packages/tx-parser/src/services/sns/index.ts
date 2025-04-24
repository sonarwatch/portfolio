import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'sns';
const contract = {
  name: 'Offer',
  address: '85iDfUvr3HJyLM2zcq5BXSiDvUWfw6cSE1FfNBo8Ap29',
  platformId,
};

const airdropContract = {
  name: 'Airdrop',
  address: 'bMersFdXPWiRzjqmbviCRMvwvN1FpRmATaqrF894CbU',
  platformId,
};
const airdropService: ServiceDefinition = {
  id: `${platformId}-airdrop`,
  name: 'Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

const offerService: ServiceDefinition = {
  id: `${platformId}-offers`,
  name: 'Offers',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: ServiceDefinition[] = [offerService, airdropService];
export default services;
