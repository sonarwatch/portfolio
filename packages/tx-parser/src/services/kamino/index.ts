import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';
import { jupiterSwapContract } from '../jupiter';

const platformId = 'kamino';

const kaminoLendContract: Contract = {
  name: 'Kamino Lend',
  address: 'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD',
  platformId,
};
const kaminoFarmContract = {
  name: 'Kamino Farm',
  address: 'FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr',
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
  contracts: [kaminoLendContract, jupiterSwapContract],
};

export const services: Service[] = [
  kaminoLendingService,
  kaminoFarmService,
  kaminoMultiplyService,
];

export default services;
