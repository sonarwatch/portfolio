import { NetworkId } from '@sonarwatch/portfolio-core';
import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { ServiceDefinition, ServicePriority } from '../../ServiceDefinition';
import { getTransactionParsedInstructions } from '../../utils/parseTransaction/getTransactionParsedInstructions';

const platformId = 'solana';

export const systemContract = {
  name: 'System',
  address: '11111111111111111111111111111111',
  platformId,
};

export const solanaComputeBudgetContract = {
  name: 'Compute Budget',
  address: 'ComputeBudget111111111111111111111111111111',
  platformId,
};

const solanaStakingContract = {
  name: 'Staking',
  address: 'Stake11111111111111111111111111111111111111',
  platformId,
};

export const solanaAssociatedTokenContract = {
  name: 'Associated Token Account',
  address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  platformId,
};

export const solanaTokenProgramContract = {
  name: 'Token Program',
  address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  platformId,
};

const solanaStakingService: ServiceDefinition = {
  id: `${platformId}-stake`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [solanaStakingContract],
};

const closeAccountService: ServiceDefinition = {
  id: `${platformId}-close`,
  name: 'Close Token Account',
  platformId,
  networkId: NetworkId.solana,
  priority: ServicePriority.low,
  matchTransaction: (txn: ParsedTransactionWithMeta) => {
    const instructions = getTransactionParsedInstructions(txn);

    if (
      instructions.length === 1 &&
      instructions[0].programId.toString() ===
        solanaTokenProgramContract.address &&
      instructions[0].parsed.type === 'closeAccount'
    )
      return true;

    return false;
  },
};

const createAccountService: ServiceDefinition = {
  id: `${platformId}-create`,
  name: 'Create Token Account',
  platformId,
  networkId: NetworkId.solana,
  priority: ServicePriority.low,
  matchTransaction: (txn: ParsedTransactionWithMeta) => {
    const instructions = getTransactionParsedInstructions(txn);

    if (
      instructions.length === 2 &&
      instructions[0].programId.toString() ===
        solanaAssociatedTokenContract.address &&
      instructions[0].parsed.type === 'create'
    )
      return true;

    return false;
  },
};

const transferService: ServiceDefinition = {
  id: `${platformId}-transfer`,
  name: 'Transfer',
  platformId,
  networkId: NetworkId.solana,
  priority: ServicePriority.low,
  matchTransaction: (txn: ParsedTransactionWithMeta) => {
    const instructions = getTransactionParsedInstructions(txn);

    if (
      instructions.length === 1 &&
      instructions[0].programId.toString() === systemContract.address &&
      instructions[0].parsed.type === 'transfer'
    )
      return true;

    if (
      instructions.length === 1 &&
      instructions[0].programId.toString() ===
        solanaTokenProgramContract.address &&
      instructions[0].parsed.type === 'transferChecked'
    )
      return true;

    if (
      instructions.length === 2 &&
      instructions[0].programId.toString() ===
        solanaAssociatedTokenContract.address &&
      instructions[0].parsed.type === 'create' &&
      instructions[1].programId.toString() ===
        solanaTokenProgramContract.address &&
      instructions[1].parsed.type === 'transferChecked'
    )
      return true;

    return false;
  },
};

export const services: ServiceDefinition[] = [
  solanaStakingService,
  createAccountService,
  closeAccountService,
  transferService,
];
export default services;
