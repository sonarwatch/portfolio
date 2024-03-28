import {
  BeetArgsStruct,
  BeetStruct,
  COption,
  FixableBeetStruct,
  array,
  coption,
  u8,
  uniformFixedSizeArray,
  u64 as beetU64,
  bignum,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u128, u64 } from '../../../utils/solana';

export type PubkeyWrapper = {
  publicKey: PublicKey;
};

export const publicKeyBeet = new BeetArgsStruct<PubkeyWrapper>(
  [['publicKey', publicKey]],
  'PubkeyWrapper'
);

export type TraderState = {
  quoteLotsLocked: bignum;
  quoteLotsFree: bignum;
  baseLotsLocked: bignum;
  baseLotsFree: bignum;
  padding: bignum[]; // size: 8
};

export const traderStateBeet = new BeetArgsStruct<TraderState>(
  [
    ['quoteLotsLocked', beetU64],
    ['quoteLotsFree', beetU64],
    ['baseLotsLocked', beetU64],
    ['baseLotsFree', beetU64],
    ['padding', uniformFixedSizeArray(beetU64, 8)],
  ],
  'TraderState'
);

export type CondensedOrder = {
  priceInTicks: BigNumber;
  sizeInBaseLots: BigNumber;
  lastValidSlot: COption<BigNumber>;
  lastValidUnixTimestampInSeconds: COption<BigNumber>;
};

export const condensedOrderBeet = new FixableBeetStruct<CondensedOrder>(
  [
    ['priceInTicks', u64],
    ['sizeInBaseLots', u64],
    ['lastValidSlot', coption(u64)],
    ['lastValidUnixTimestampInSeconds', coption(u64)],
  ],
  (args) => args as CondensedOrder
);

export enum FailedMultipleLimitOrderBehavior {
  FailOnInsufficientFundsAndAmendOnCross,
  FailOnInsufficientFundsAndFailOnCross,
  SkipOnInsufficientFundsAndAmendOnCross,
  SkipOnInsufficientFundsAndFailOnCross,
}

export type MultipleOrderPacket = {
  bids: CondensedOrder[];
  asks: CondensedOrder[];
  clientOrderId: COption<BigNumber>;
  failedMultipleLimitOrderBehavior: FailedMultipleLimitOrderBehavior;
};

export const multipleOrderPacketStruct =
  new FixableBeetStruct<MultipleOrderPacket>(
    [
      ['bids', array(condensedOrderBeet)],
      ['asks', array(condensedOrderBeet)],
      ['clientOrderId', coption(u128)],
      ['failedMultipleLimitOrderBehavior', u8],
    ],
    (args) => args as MultipleOrderPacket
  );

export type OrderId = {
  priceInTicks: BigNumber;
  orderSequenceNumber: BigNumber;
};

export const orderIdBeet = new BeetArgsStruct<OrderId>(
  [
    ['priceInTicks', u64],
    ['orderSequenceNumber', u64],
  ],
  'fIFOOrderId'
);

export type RestingOrder = {
  traderIndex: BigNumber;
  numBaseLots: BigNumber;
  lastValidSlot: BigNumber;
  lastValidUnixTimestampInSeconds: BigNumber;
};

export const restingOrderBeet = new BeetStruct<RestingOrder>(
  [
    ['traderIndex', u64],
    ['numBaseLots', u64],
    ['lastValidSlot', u64],
    ['lastValidUnixTimestampInSeconds', u64],
  ],
  (args) => args as RestingOrder
);
