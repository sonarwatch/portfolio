import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { solanaStakingContract } from '../solana';

const platformId = 'solayer';
const solayerContract = {
  name: 'Solayer',
  address: 'sSo1iU21jBrU9VaJ8PJib1MtorefUV4fzC9GURa2KNn',
  platformId,
};

const stakePoolContract = {
  name: 'Stake Pool',
  address: 'SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy',
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

const solayerService: ServiceDefinition = {
  id: `${platformId}`,
  name: 'Solayer',
  platformId,
  networkId: NetworkId.solana,
  contracts: [solanaStakingContract],
};

const restakingService: ServiceDefinition = {
  id: `${platformId}-restaking`,
  name: 'Restaking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [solayerContract, stakePoolContract],
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

export const services: ServiceDefinition[] = [
  solayerService,
  airdropService,
  sUSDService,
  restakingService,
];
export default services;
