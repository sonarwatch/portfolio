import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';

const platformId = 'magiceden';

const airdropContract = {
  name: 'Magic Claim',
  address: 'mcmexbLZHASMjxjARNvDhXnEQT8vMP4uWnBi1Et8RdX',
  platformId,
};

const escrowContract = {
  name: 'MarketPlace',
  address: 'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
  platformId,
};

const stakingContract = {
  name: 'Staking',
  address: 'veTbq5fF2HWYpgmkwjGKTYLVpY6miWYYmakML7R7LRf',
  platformId,
};

const auctionContract = {
  name: 'Auction',
  address: 'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe',
  platformId,
};

const airdropService: ServiceDefinition = {
  id: `${platformId}-magic-claim`,
  name: 'Magic Claim',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

const escrowService: ServiceDefinition = {
  id: `${platformId}-marketPlace`,
  name: 'MarketPlace',
  platformId,
  networkId: NetworkId.solana,
  contracts: [escrowContract],
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

const auctionService: ServiceDefinition = {
  id: `${platformId}-auction`,
  name: 'Auction',
  platformId,
  networkId: NetworkId.solana,
  contracts: [auctionContract],
};

export const services: ServiceDefinition[] = [
  airdropService,
  escrowService,
  stakingService,
  auctionService,
];
export default services;
