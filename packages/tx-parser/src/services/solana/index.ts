import { NetworkId } from '@sonarwatch/portfolio-core';
import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { ServiceDefinition, ServicePriority } from '../../ServiceDefinition';
import { getRelevantInstructions } from '../../utils/parseTransaction/getRelevantInstructions';
import { isParsedInstruction } from '../../utils/parseTransaction/isParsedInstruction';

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

export const solanaStakePoolContract = {
  name: 'Stake Pool',
  address: 'SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy',
  platformId,
};

const stakingService: ServiceDefinition = {
  id: `${platformId}-stake`,
  name: 'Staking',
  platformId,
  networkId: NetworkId.solana,
  contracts: [solanaStakingContract],
};

const stakePoolService: ServiceDefinition = {
  id: `${platformId}-stake-pool`,
  name: 'Stake Pool',
  platformId,
  networkId: NetworkId.solana,
  contracts: [solanaStakePoolContract],
};

const closeAccountService: ServiceDefinition = {
  id: `${platformId}-close`,
  name: 'Close Token Account',
  platformId,
  networkId: NetworkId.solana,
  priority: ServicePriority.low,
  matchTransaction: (txn: ParsedTransactionWithMeta) => {
    const instructions = getRelevantInstructions(txn);

    return (
      instructions.length === 1 &&
      instructions[0].programId.toString() ===
        solanaTokenProgramContract.address &&
      isParsedInstruction(instructions[0]) &&
      instructions[0].parsed.type === 'closeAccount'
    );
  },
};

const createAccountService: ServiceDefinition = {
  id: `${platformId}-create`,
  name: 'Create Token Account',
  platformId,
  networkId: NetworkId.solana,
  priority: ServicePriority.low,
  matchTransaction: (txn: ParsedTransactionWithMeta) => {
    const instructions = getRelevantInstructions(txn);

    return (
      instructions.length === 1 &&
      instructions[0].programId.toString() ===
        solanaAssociatedTokenContract.address &&
      isParsedInstruction(instructions[0]) &&
      instructions[0].parsed.type === 'create'
    );
  },
};

const transferService: ServiceDefinition = {
  id: `${platformId}-transfer`,
  name: 'Transfer',
  platformId,
  networkId: NetworkId.solana,
  priority: ServicePriority.low,
  matchTransaction: (txn: ParsedTransactionWithMeta) => {
    const instructions = getRelevantInstructions(txn);

    if (
      instructions.length === 1 &&
      instructions[0].programId.toString() === systemContract.address &&
      isParsedInstruction(instructions[0]) &&
      instructions[0].parsed.type === 'transfer'
    )
      return true;

    if (
      instructions.length === 1 &&
      instructions[0].programId.toString() ===
        solanaTokenProgramContract.address &&
      isParsedInstruction(instructions[0]) &&
      instructions[0].parsed.type === 'transferChecked'
    )
      return true;

    if (
      instructions.length === 2 &&
      instructions[0].programId.toString() ===
        solanaAssociatedTokenContract.address &&
      isParsedInstruction(instructions[0]) &&
      instructions[0].parsed.type === 'create' &&
      instructions[1].programId.toString() ===
        solanaTokenProgramContract.address &&
      isParsedInstruction(instructions[1]) &&
      instructions[1].parsed.type === 'transferChecked'
    )
      return true;

    return false;
  },
};

const burnService: ServiceDefinition = {
  id: `${platformId}-burn`,
  name: 'Burn',
  platformId,
  networkId: NetworkId.solana,
  priority: ServicePriority.low,
  matchTransaction: (txn: ParsedTransactionWithMeta) => {
    const instructions = getRelevantInstructions(txn);

    return (
      instructions.length === 1 &&
      instructions[0].programId.toString() ===
        solanaTokenProgramContract.address &&
      isParsedInstruction(instructions[0]) &&
      instructions[0].parsed.type === 'burn'
    );
  },
};

export const services: ServiceDefinition[] = [
  stakingService,
  stakePoolService,
  createAccountService,
  closeAccountService,
  transferService,
  burnService,
];
export default services;
