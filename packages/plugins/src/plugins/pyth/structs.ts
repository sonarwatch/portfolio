import {
  array,
  BeetStruct,
  FixableBeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import { blob } from '../../utils/solana';

export type Position = {
  array: number[];
};

export const positionStruct = new BeetStruct<Position>(
  [['array', uniformFixedSizeArray(u8, 200)]],
  (args) => args as Position
);

export type PositionData = {
  buffer: Buffer;
  owner: PublicKey;
  positions: Position[];
};

export const positionDataStruct = new FixableBeetStruct<PositionData>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['positions', array(positionStruct)],
  ],
  (args) => args as PositionData
);
