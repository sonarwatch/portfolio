import { Metadata, Nft, Sft } from '@metaplex-foundation/js';
import { positionsIdentifier } from './constants';

export function isAnOrcaPosition(nft: Metadata | Nft | Sft): boolean {
  return nft && nft.name === positionsIdentifier;
}
