import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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
const airdropService: Service = {
  id: `${platformId}-airdrop`,
  name: 'Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

const offerService: Service = {
  id: `${platformId}-offers`,
  name: 'Offers',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

export const services: Service[] = [offerService, airdropService];
export default services;
