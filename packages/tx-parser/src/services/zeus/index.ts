import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'zeus';

const bootstrapperContract = {
  name: 'Bootstrapper',
  address: 'ZPLsAzVmV6gRipY8dzoWcGWJ81tkPUN9M7YfxJPru9w',
  platformId,
};
const bitcoinSPVContract = {
  name: 'BitcoinSPV',
  address: 'ZPLowzr41tCGkoRXuzEx4Ts98Jjrbfe9rtv7gqdgGkH',
  platformId,
};
const layerCAContract = {
  name: 'LayerCA',
  address: 'ZPLtKX3gHTa4djEdmkZXkXiJdTUEeD5ZjZD4jAnxrSP',
  platformId,
};
const delegatorContract = {
  name: 'Delegator',
  address: 'ZPLt7XEyRvRxEZcGFGnRKGLBymFjQbwmgTZhMAMfGAU',
  platformId,
};
const liquidityManagementContract = {
  name: 'LiquidityManagement',
  address: 'ZPLuj6HoZ2z6y6WfJuHz3Gg48QeMZ6kGbsa74oPxACY',
  platformId,
};
const twoWayPegContract = {
  name: 'TwoWayPeg',
  address: 'ZPLzxjNk1zUAgJmm3Jkmrhvb4UaLwzvY2MotpfovF5K',
  platformId,
};


const bootstrapperService: ServiceDefinition = {
  id: `${platformId}-delegator`,
  name: 'Bootstrapper',
  platformId,
  networkId: NetworkId.solana,
  contracts: [bootstrapperContract],
};
const bitcoinSPVService: ServiceDefinition = {
  id: `${platformId}-delegator`,
  name: 'BitcoinSPV',
  platformId,
  networkId: NetworkId.solana,
  contracts: [bitcoinSPVContract],
};
const layerCAService: ServiceDefinition = {
  id: `${platformId}-delegator`,
  name: 'LayerCA',
  platformId,
  networkId: NetworkId.solana,
  contracts: [layerCAContract],
};
const stakingService: ServiceDefinition = {
  id: `${platformId}-delegator`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [delegatorContract],
};
const liquidityManagementService: ServiceDefinition = {
  id: `${platformId}-delegator`,
  name: 'LiquidityManagement',
  platformId,
  networkId: NetworkId.solana,
  contracts: [liquidityManagementContract],
};
const twoWayPegService: ServiceDefinition = {
  id: `${platformId}-delegator`,
  name: 'TwoWayPeg',
  platformId,
  networkId: NetworkId.solana,
  contracts: [twoWayPegContract],
};

export const services: ServiceDefinition[] = [bootstrapperService, bitcoinSPVService, layerCAService, stakingService, liquidityManagementService, twoWayPegService];
export default services;
