import { NetworkId, Service } from '@sonarwatch/portfolio-core';

const platformId = 'magiceden';

const airdropContract = {
  name: 'Magic Claim',
  address: 'mcmexbLZHASMjxjARNvDhXnEQT8vMP4uWnBi1Et8RdX',
  platformId,
};

const escroContract = {
  name: 'Escrow',
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

const airdropService: Service = {
  id: `${platformId}-magic-claim`,
  name: 'Magic Claim',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

const escrowService: Service = {
  id: `${platformId}-escrow`,
  name: 'Escrow',
  platformId,
  networkId: NetworkId.solana,
  contracts: [escroContract],
};

const stakingService: Service = {
  id: `${platformId}-staking`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [stakingContract],
};

const auctionService: Service = {
  id: `${platformId}-auction`,
  name: 'Auction',
  platformId,
  networkId: NetworkId.solana,
  contracts: [auctionContract],
};

export const services: Service[] = [
  airdropService,
  escrowService,
  stakingService,
  auctionService,
];
export default services;
