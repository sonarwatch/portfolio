import { Contract, NetworkId, Service } from '@sonarwatch/portfolio-core';
import { farmProgramId, klendProgramId, platformId } from './constants';
import { jupiterSwapContract } from '../jupiter/services';
import { ServiceDirectory } from '../../utils/directories/serviceDirectory';

const kaminoLendContract: Contract = {
  name: 'Kamino Lend',
  address: klendProgramId.toString(),
  platformId,
};
const kaminoFarmContract = {
  name: 'Kamino Farm',
  address: farmProgramId.toString(),
  platformId,
};
export const kaminoLendingService: Service = {
  id: `${platformId}-lend`,
  name: 'Lending',
  platformId,
  networkId: NetworkId.solana,
  contracts: [kaminoLendContract],
};
export const kaminoFarmService = {
  id: `${platformId}-farm`,
  name: 'Farm',
  platformId,
  networkId: NetworkId.solana,
  contracts: [kaminoFarmContract],
};
export const kaminoMultiplyService: Service = {
  id: `${platformId}-multiply`,
  name: 'Multiply',
  platformId,
  networkId: NetworkId.solana,
  contracts: [kaminoLendContract, jupiterSwapContract],
};

ServiceDirectory.addServices([
  kaminoLendingService,
  kaminoFarmService,
  kaminoMultiplyService,
]);
