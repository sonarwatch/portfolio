import { Contract, NetworkId } from '@sonarwatch/portfolio-core';
import { jupiterV6Contract } from '../jupiter';
import { contract } from '../dflow';
import { expressRelayContract } from '../pyth';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'kamino';

export const kaminoLendContract: Contract = {
  name: 'Kamino Lend',
  address: 'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD',
  platformId,
};
const poolsContract = {
  name: 'Liquidity',
  address: '6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc',
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
const swapService: ServiceDefinition = {
  id: `${platformId}-swap-dflow`,
  name: 'Swap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [limitOrderContract, contract],
};
const swapJupiterService: ServiceDefinition = {
  id: `${platformId}-swap-jupiter`,
  name: 'Swap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [limitOrderContract, jupiterV6Contract],
};

const swapPythService: ServiceDefinition = {
  id: `${platformId}-swap-pyth`,
  name: 'Swap',
  platformId,
  networkId: NetworkId.solana,
  contracts: [limitOrderContract, expressRelayContract],
};

const kaminoLiquidityService: ServiceDefinition = {
  id: `${platformId}-liquidity`,
  name: 'Liquidity',
  platformId,
  networkId: NetworkId.solana,
  contracts: [poolsContract],
};

export const services: ServiceDefinition[] = [
  kaminoLendingService,
  kaminoFarmService,
  kaminoMultiplyService,
  kaminoLimitOrderService,
  swapService,
  swapJupiterService,
  swapPythService,
  kaminoLiquidityService,
];

export default services;
