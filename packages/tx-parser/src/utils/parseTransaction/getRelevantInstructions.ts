import {
  ParsedInstruction,
  ParsedTransactionWithMeta,
  PartiallyDecodedInstruction,
} from '@solana/web3.js';
import { isParsedInstruction } from './isParsedInstruction';

export const getRelevantInstructions = (txn: ParsedTransactionWithMeta) =>
  txn.transaction.message.instructions
    .map((i) => {
      if (isParsedInstruction(i)) {
        return i.programId.toString() !==
          'ComputeBudget111111111111111111111111111111' &&
          !(
            i.programId.toString() === '11111111111111111111111111111111' &&
            i.parsed.type === 'advanceNonce'
          )
          ? i
          : null;
      }
      return i;
    })
    .filter((i) => i !== null) as (
    | ParsedInstruction
    | PartiallyDecodedInstruction
  )[];
