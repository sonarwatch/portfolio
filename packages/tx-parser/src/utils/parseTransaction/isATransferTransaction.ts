import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { getRelevantInstructions } from './getRelevantInstructions';
import { isParsedInstruction } from './isParsedInstruction';

export default function isATransferTransaction(
  txn: ParsedTransactionWithMeta
): boolean {
  const instructions = getRelevantInstructions(txn);

  if (
    instructions.length === 1 &&
    instructions[0].programId.toString() ===
      '11111111111111111111111111111111' &&
    isParsedInstruction(instructions[0]) &&
    instructions[0].parsed.type === 'transfer'
  )
    return true;

  if (
    instructions.length === 1 &&
    instructions[0].programId.toString() ===
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' &&
    isParsedInstruction(instructions[0]) &&
    instructions[0].parsed.type === 'transferChecked'
  )
    return true;

  if (
    instructions.length === 2 &&
    instructions[0].programId.toString() ===
      'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL' &&
    isParsedInstruction(instructions[0]) &&
    instructions[0].parsed.type === 'create' &&
    instructions[1].programId.toString() ===
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' &&
    isParsedInstruction(instructions[1]) &&
    instructions[1].parsed.type === 'transferChecked'
  )
    return true;

  return false;
}
