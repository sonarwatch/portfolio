import {
  ParsedInstruction,
  PartiallyDecodedInstruction,
} from '@solana/web3.js';

export function isParsedInstruction(
  instr: ParsedInstruction | PartiallyDecodedInstruction
): instr is ParsedInstruction {
  return !!instr && 'parsed' in instr;
}
