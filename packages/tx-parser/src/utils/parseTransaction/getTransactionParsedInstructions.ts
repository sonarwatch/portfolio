import { ParsedInstruction, ParsedTransactionWithMeta } from '@solana/web3.js';
import { isParsedInstruction } from './isParsedInstruction';

export const getTransactionParsedInstructions = (
  txn: ParsedTransactionWithMeta
) =>
  txn.transaction.message.instructions
    .map((i) =>
      isParsedInstruction(i) &&
      i.programId.toString() !==
        'ComputeBudget111111111111111111111111111111' &&
      !(
        i.programId.toString() === '11111111111111111111111111111111' &&
        i.parsed.type === 'advanceNonce'
      )
        ? i
        : null
    )
    .filter((i) => i !== null) as ParsedInstruction[];
