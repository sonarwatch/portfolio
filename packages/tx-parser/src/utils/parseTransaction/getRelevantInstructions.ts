import {
  ParsedInstruction,
  ParsedTransactionWithMeta,
  PartiallyDecodedInstruction,
} from '@solana/web3.js';
import { isParsedInstruction } from './isParsedInstruction';

const memoProgramIds = [
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
  'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo',
];

export const getRelevantInstructions = (txn: ParsedTransactionWithMeta) =>
  txn.transaction.message.instructions
    .map((i) => {
      if (
        i.programId.toString() === 'ComputeBudget111111111111111111111111111111'
      ) {
        return null;
      }

      if (memoProgramIds.includes(i.programId.toString())) {
        return null;
      }

      if (isParsedInstruction(i)) {
        if (
          i.programId.toString() === '11111111111111111111111111111111' &&
          i.parsed.type === 'advanceNonce'
        ) {
          return null;
        }
      }
      return i;
    })
    .filter((i) => i !== null) as (
    | ParsedInstruction
    | PartiallyDecodedInstruction
  )[];
