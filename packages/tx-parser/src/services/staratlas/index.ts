import { NetworkId, Service } from '@sonarwatch/portfolio-core';

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

const service: Service = {
  id: `${platformId}-governance`,
  name: 'Governance',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract, lockerContract],
};

export const services: Service[] = [service];
export default services;
