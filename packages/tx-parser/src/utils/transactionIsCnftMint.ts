import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { bubblegumContract } from '../services/metaplex';
import { isPartiallyDecodedInstruction } from './isPartiallyDecodedInstruction';
import { getDiscriminator } from './getDiscriminator';

const mintToCollectionV1InstructionDiscriminator = [
  153, 18, 178, 47, 197, 158, 86, 15,
];
const mintV1InstructionDiscriminator = [145, 98, 192, 118, 184, 147, 118, 104];

export const transactionIsCnftMint = (
  txn: ParsedTransactionWithMeta
): boolean =>
  txn.transaction.message.instructions.some(
    (i) =>
      i.programId.toString() === bubblegumContract.address &&
      isPartiallyDecodedInstruction(i) &&
      [
        mintToCollectionV1InstructionDiscriminator,
        mintV1InstructionDiscriminator,
      ].includes(getDiscriminator(i.data))
  );
