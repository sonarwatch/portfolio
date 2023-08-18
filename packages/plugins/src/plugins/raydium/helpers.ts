/* eslint-disable no-bitwise */
import { Metadata, Nft, Sft } from '@metaplex-foundation/js';
import { positionsIdentifier } from './constants';

export function isARaydiumPosition(nft: Metadata | Nft | Sft): boolean {
  return nft && nft.name === positionsIdentifier;
}
