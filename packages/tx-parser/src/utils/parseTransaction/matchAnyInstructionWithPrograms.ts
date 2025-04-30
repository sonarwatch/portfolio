import { ParsedTransactionWithMeta } from '@solana/web3.js';

export function matchAnyInstructionWithPrograms(
  tx: ParsedTransactionWithMeta,
  programs: string[]
): boolean {
  return tx.transaction.message.instructions.some((instruction) =>
    programs.includes(instruction.programId.toString())
  );
}
