import { NetworkId } from '@sonarwatch/portfolio-core';
import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { ServiceDefinition, ServicePriority } from '../../ServiceDefinition';
import { getRelevantInstructions } from '../../utils/parseTransaction/getRelevantInstructions';
import { transactionContainsJitotip } from '../../utils/parseTransaction/transactionContainsJitotip';

const platformId = 'jito';

const contract = {
  name: 'Governance',
  address: 'jtogvBNH3WBSWDYD5FJfQP2ZxNTuf82zL8GkEhPeaJx',
  platformId,
};

const restakingContract = {
  name: 'Restaking',
  address: 'Vau1t6sLNxnzB7ZDsef8TLbPLfyZMYXH8WTNqUdm9g8',
  platformId,
};

const airdropContract = {
  name: 'Airdrop',
  address: 'mERKcfxMC5SqJn4Ld4BUris3WKZZ1ojjWJ3A3J5CKxv',
  platformId,
};

const service: ServiceDefinition = {
  id: `${platformId}-governance`,
  name: 'Governance',
  platformId,
  networkId: NetworkId.solana,
  contracts: [contract],
};

const restakingService: ServiceDefinition = {
  id: `${platformId}-restaking`,
  name: 'Restaking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [restakingContract],
};

const tipService: ServiceDefinition = {
  id: `${platformId}-tip`,
  name: 'Tip',
  platformId,
  networkId: NetworkId.solana,
  priority: ServicePriority.low,
  matchTransaction: (txn: ParsedTransactionWithMeta) => {
    const instructions = getRelevantInstructions(txn);

    return instructions.length === 1 && transactionContainsJitotip(txn);
  },
};

const airdropService: ServiceDefinition = {
  id: `${platformId}-airdrop`,
  name: 'Airdrop',
  platformId,
  networkId: NetworkId.solana,
  contracts: [airdropContract],
};

export const services: ServiceDefinition[] = [
  service,
  restakingService,
  tipService,
  airdropService,
];
export default services;
