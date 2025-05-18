import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { matchAnyInstructionWithPrograms } from '../../utils/parseTransaction/matchAnyInstructionWithPrograms';

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

const recordContract = {
  name: 'Records Program',
  address: 'HP3D4D1ZCmohQGFVms2SS4LCANgJyksBf5s1F77FuFjZ',
  platformId,
};

const nameServiceContract = {
  name: 'Name Service',
  address: 'namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX',
  platformId,
};

const registrarContract = {
  name: 'Registrar',
  address: 'jCebN34bUfdeUYJT13J1yG16XWQpt5PDx6Mse9GUqhR',
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
  name: 'Name Service',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) =>
    matchAnyInstructionWithPrograms(tx, [
      recordContract.address,
      nameServiceContract.address,
      registrarContract.address,
    ]),
};

export const services: ServiceDefinition[] = [
  offerService,
  airdropService,
  mainService,
];
export default services;
