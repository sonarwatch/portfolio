import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { systemContract } from '../../services/solana';
import { getRelevantInstructions } from './getRelevantInstructions';
import { isParsedInstruction } from './isParsedInstruction';

// https://jito-foundation.gitbook.io/mev/mev-payment-and-distribution/on-chain-addresses
const tipPaymentsAccounts = [
  '96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5',
  'HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe',
  'Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY',
  'ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49',
  'DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh',
  'ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt',
  'DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL',
  '3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT',
];

export const transactionContainsJitotip = (
  txn: ParsedTransactionWithMeta
): boolean =>
  getRelevantInstructions(txn).some(
    (i) =>
      i.programId.toString() === systemContract.address &&
      isParsedInstruction(i) &&
      i.parsed.type === 'transfer' &&
      tipPaymentsAccounts.includes(i.parsed.info.destination)
  );
