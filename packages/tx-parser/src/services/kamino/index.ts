import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { jupiterV6Contract } from '../jupiter';

const platformId = 'kamino';

export const kaminoLendContract: Contract = {
  name: 'Kamino Lend',
  address: 'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD',
  platformId,
};
const kaminoFarmContract = {
  name: 'Kamino Farm',
  address: 'FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr',
  platformId,
};

const limitOrderContract = {
  name: 'Kamino Limit Order',
  address: 'LiMoM9rMhrdYrfzUCxQppvxCSG1FcrUK9G8uLq4A1GF',
  platformId,
};

const kaminoLendingService: ServiceDefinition = {
  id: `${platformId}-lend`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [kaminoLendContract],
};
const kaminoFarmService = {
  id: `${platformId}-farm`,
  name: 'Farm',
  platformId,
  networkId: NetworkId.solana,
  contracts: [kaminoFarmContract],
};
const kaminoMultiplyService: ServiceDefinition = {
  id: `${platformId}-multiply`,
  name: 'Multiply',
  platformId,
  networkId: NetworkId.solana,
  contracts: [kaminoLendContract, jupiterV6Contract],
};
const kaminoLimitOrderService: ServiceDefinition = {
  id: `${platformId}-limit-order`,
  name: 'Limit Order',
  platformId,
  networkId: NetworkId.solana,
  contracts: [limitOrderContract],
};

export const services: ServiceDefinition[] = [
  kaminoLendingService,
  kaminoFarmService,
  kaminoMultiplyService,
  kaminoLimitOrderService,
];

export default services;
