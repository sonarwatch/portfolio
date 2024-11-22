import {
  BeetStruct,
  i32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { i64, u64 } from '../beets/numbers';
import { blob } from '../beets/buffers';

export type PriceFeedMessage = {
  buffer: Buffer;
  feedId: number[];
  price: BigNumber;
  conf: BigNumber;
  exponent: number;
  publishTime: BigNumber;
  prevPublishTime: BigNumber;
  emaPrice: BigNumber;
  emaConf: BigNumber;
};

export const priceFeedMessageStruct = new BeetStruct<PriceFeedMessage>(
  [
    ['buffer', blob(8)],
    ['feedId', uniformFixedSizeArray(u8, 32)],
    ['price', i64],
    ['conf', u64],
    ['exponent', i32],
    ['publishTime', i64],
    ['prevPublishTime', i64],
    ['emaPrice', i64],
    ['emaConf', u64],
  ],
  (args) => args as PriceFeedMessage
);

export enum VerificationLevel {
  Partial,
  Full,
}

export type PriceUpdateV2 = {
  writeAuthority: PublicKey;
  verificationLevel: VerificationLevel;
  priceMessage: PriceFeedMessage;
  postedSlot: BigNumber;
  overlapAmount: BigNumber;
};

export const priceUpdateV2Struct = new BeetStruct<PriceUpdateV2>(
  [
    ['writeAuthority', publicKey],
    ['verificationLevel', u8],
    ['priceMessage', priceFeedMessageStruct],
    ['postedSlot', u64],
  ],
  (args) => args as PriceUpdateV2
);
