import {
  ParsedInstruction,
  PartiallyDecodedInstruction,
} from '@solana/web3.js';

export function isPartiallyDecodedInstruction(
  instr: ParsedInstruction | PartiallyDecodedInstruction
): instr is PartiallyDecodedInstruction {
  return !!instr && 'data' in instr;
}
