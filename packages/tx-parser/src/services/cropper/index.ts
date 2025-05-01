import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'cropper';

const stakingContract = {
  name: 'Staking',
  address: 'HYzrD877vEcBgd6ySKPpa3pcMbqYEmwEF1GFQmvuswcC',
  platformId,
};

const clmmContract = {
  name: 'CLMM',
  address: 'H8W3ctz92svYg6mkn1UtGfu2aQr2fnUFHM1RhScEtQDt',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

const clmmService: ServiceDefinition = {
  id: `${platformId}-liquidity`,
  name: 'Liquidity',
  platformId,
  networkId: NetworkId.solana,
  contracts: [clmmContract],
};

export const services: ServiceDefinition[] = [stakingService, clmmService];
export default services;
