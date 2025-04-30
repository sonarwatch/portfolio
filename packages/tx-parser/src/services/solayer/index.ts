import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { solanaStakePoolContract } from '../solana';

const platformId = 'solayer';
const solayerContract = {
  name: 'Solayer',
  address: 'sSo1iU21jBrU9VaJ8PJib1MtorefUV4fzC9GURa2KNn',
  platformId,
};

const airdropContract = {
  name: 'Airdrop',
  address: 'ARDPkhymCbfdan375FCgPnBJQvUfHeb7nHVdBfwWSxrp',
  platformId,
};

const sUDCContract = {
  name: 'sUDC',
  address: 's1aysqpEyZyijPybUV89oBGeooXrR22wMNLjnG2SWJA',
  platformId,
};

const endoAvsContract = {
  name: 'Endo Avs',
  address: 'endoLNCKTqDn8gSVnN2hDdpgACUPWHZTwoYnnMybpAT',
  platformId,
};

const solayerService: ServiceDefinition = {
  id: `${platformId}`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [solayerContract],
};

const restakingService: ServiceDefinition = {
  id: `${platformId}-restaking`,
  name: 'Restaking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [solayerContract, solanaStakePoolContract],
};

const airdropService: ServiceDefinition = {
  id: `${platformId}-airdrop`,
  name: 'Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

const sUSDService: ServiceDefinition = {
  id: `${platformId}-susd`,
  name: 'sUSD',
  platformId,
  networkId: NetworkId.solana,
  contracts: [sUDCContract],
};

const delegateService: ServiceDefinition = {
  id: `${platformId}-delegate`,
  name: 'Delegate',
  platformId,
  networkId: NetworkId.solana,
  contracts: [endoAvsContract, solayerContract, solanaStakePoolContract],
};

export const services: ServiceDefinition[] = [
  solayerService,
  airdropService,
  sUSDService,
  restakingService,
  delegateService,
];
export default services;
