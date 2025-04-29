import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { bubblegumContract } from '../../services/metaplex';
import { isPartiallyDecodedInstruction } from './isPartiallyDecodedInstruction';
import { getDiscriminator } from './getDiscriminator';

const mintToCollectionV1InstructionDiscriminator = [
  153, 18, 178, 47, 197, 158, 86, 15,
];
const mintV1InstructionDiscriminator = [145, 98, 192, 118, 184, 147, 118, 104];

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

export const transactionIsCnftMint = (
  txn: ParsedTransactionWithMeta
): boolean =>
  txn.transaction.message.instructions.some((i) => {
    if (
      i.programId.toString() !== bubblegumContract.address ||
      !isPartiallyDecodedInstruction(i)
    ) {
      return false;
    }
    const discriminator = getDiscriminator(i.data);
    return [
      mintToCollectionV1InstructionDiscriminator,
      mintV1InstructionDiscriminator,
    ].some((d) => arraysEqual(d, discriminator));
  });
