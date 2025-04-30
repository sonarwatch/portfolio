import { NetworkId } from '@sonarwatch/portfolio-core';
import { ServiceDefinition } from '../../ServiceDefinition';
import { matchAnyInstructionWithPrograms } from '../../utils/parseTransaction/matchAnyInstructionWithPrograms';

const platformId = 'magiceden';

const airdropContract = {
  name: 'Magic Claim',
  address: 'mcmexbLZHASMjxjARNvDhXnEQT8vMP4uWnBi1Et8RdX',
  platformId,
};

const distributionContract = {
  name: 'Magic Claim Distribution',
  address: 'disGCfSiJKFigEphfou4PGHn1rukMfbs9cg9GpTM6oe',
  platformId,
};

const escrowContract = {
  name: 'MarketPlace',
  address: 'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
  platformId,
};

const cnftContract = {
  name: 'CNFT',
  address: 'M3mxk5W2tt27WGT7THox7PmgRDp4m6NEhL5xvxrBfS1',
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

const candyMachineContract = {
  name: 'Candy Machine',
  address: 'CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb',
  platformId,
};

const airdropService: ServiceDefinition = {
  id: `${platformId}-airdrop`,
  name: 'Airdrop',
  platformId,
  networkId: NetworkId.solana,
  matchTransaction: (tx) =>
    matchAnyInstructionWithPrograms(tx, [
      airdropContract.address,
      distributionContract.address,
    ]),
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

const cnftService: ServiceDefinition = {
  id: `${platformId}-cnft`,
  name: 'cNFT',
  platformId,
  networkId: NetworkId.solana,
  contracts: [cnftContract],
};

const launchpadService: ServiceDefinition = {
  id: `${platformId}-launchpad`,
  name: 'Launchpad',
  platformId,
  networkId: NetworkId.solana,
  contracts: [candyMachineContract],
};

export const services: ServiceDefinition[] = [
  airdropService,
  escrowService,
  stakingService,
  auctionService,
  cnftService,
  launchpadService,
];
export default services;
