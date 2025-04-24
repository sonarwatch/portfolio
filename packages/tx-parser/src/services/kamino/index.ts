import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';
import { jupiterV6Contract } from '../jupiter';
import { contract } from '../dflow';
import { expressRelayContract } from '../pyth';

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

const kaminoLendingService: Service = {
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
const kaminoMultiplyService: Service = {
  id: `${platformId}-multiply`,
  name: 'Multiply',
  platformId,
  networkId: NetworkId.solana,
  contracts: [kaminoLendContract, jupiterV6Contract],
};
const kaminoLimitOrderService: Service = {
  id: `${platformId}-limit-order`,
  name: 'Limit Order',
  platformId,
  networkId: NetworkId.solana,
  contracts: [limitOrderContract],
};
const swapService: Service = {
  id: `${platformId}-swap-dflow`,
  name: 'Swap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [limitOrderContract, contract],
};
const swapJupiterService: Service = {
  id: `${platformId}-swap-jupiter`,
  name: 'Swap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [limitOrderContract, jupiterV6Contract],
};

const swapPythService: Service = {
  id: `${platformId}-swap-pyth`,
  name: 'Swap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [limitOrderContract, expressRelayContract],
};

export const services: Service[] = [
  kaminoLendingService,
  kaminoFarmService,
  kaminoMultiplyService,
  kaminoLimitOrderService,
  swapService,
  swapJupiterService,
  swapPythService,
];

export default services;
