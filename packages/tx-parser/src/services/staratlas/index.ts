import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'staratlas';
const stakingContract = {
  name: 'Staking',
  address: 'ATLocKpzDbTokxgvnLew3d7drZkEzLzDpzwgrgWKDbmc',
  platformId,
};

const lockerContract = {
  name: 'Locker',
  address: 'Lock7kBijGCQLEFAmXcengzXKA88iDNQPriQ7TbgeyG',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-governance`,
  name: 'Governance',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract, lockerContract],
};

export const services: ServiceDefinition[] = [service];
export default services;
