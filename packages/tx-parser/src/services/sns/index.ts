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

const mainContract = {
  name: 'Main',
  address: 'HP3D4D1ZCmohQGFVms2SS4LCANgJyksBf5s1F77FuFjZ',
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

const mainService: ServiceDefinition = {
  id: `${platformId}-domaine-name`,
  name: 'Domain Name',
  platformId,
  networkId: NetworkId.solana,
  contracts: [mainContract],
};

export const services: ServiceDefinition[] = [
  offerService,
  airdropService,
  mainService,
];
export default services;
