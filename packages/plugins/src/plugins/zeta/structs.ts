import {
  BeetStruct,
  FixableBeetStruct,
  bool,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@metaplex-foundation/js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export enum MarginAccountType {
  Normal,
  MarketMaker,
}

export type AnchorDecimal = {
  flags: number;
  hi: number;
  lo: number;
  mid: number;
};
export const anchorDecimalStruct = new BeetStruct<AnchorDecimal>(
  [
    ['flags', u32],
    ['hi', u32],
    ['lo', u32],
    ['mid', u32],
  ],
  (args) => args as AnchorDecimal
);

export type Position = {
  size: BigNumber;
  costOfTrades: BigNumber;
};
export const positionStruct = new BeetStruct<Position>(
  [
    ['size', i64],
    ['costOfTrades', u64],
  ],
  (args) => args as Position
);

export type OrderState = {
  closingOrders: BigNumber;
  openingOrder1: BigNumber;
  openingOrder2: BigNumber;
};
export const orderStateStruct = new BeetStruct<OrderState>(
  [
    ['closingOrders', u64],
    ['openingOrder1', u64],
    ['openingOrder2', u64],
  ],
  (args) => args as OrderState
);

export type ProductLedger = {
  position: Position;
  orderState: OrderState;
};
export const productLedgerStruct = new BeetStruct<ProductLedger>(
  [
    ['position', positionStruct],
    ['orderState', orderStateStruct],
  ],
  (args) => args as ProductLedger
);

export type CrossMarginAccount = {
  buffer: Buffer;
  authority: PublicKey;
  delegatedPubkey: PublicKey;
  balance: BigNumber;
  subaccountIndex: number;
  nonce: number;
  forceCancelFlag: boolean;
  accountType: MarginAccountType;
  openOrdersNonces: number[];
  openOrdersNoncesPadding: number[];
  rebalanceAmount: BigNumber;
  lastFundingDeltas: AnchorDecimal[];
  lastFundingDeltasPadding: AnchorDecimal[];
  productLedgers: ProductLedger[];
  productLedgersPadding: ProductLedger[];
  padding: Buffer[];
};

export const crossMarginAccountStruct =
  new FixableBeetStruct<CrossMarginAccount>(
    [
      ['buffer', blob(8)],
      ['authority', publicKey],
      ['delegatedPubkey', publicKey],
      ['balance', u64],
      ['subaccountIndex', u8],
      ['nonce', u8],
      ['forceCancelFlag', bool],
      ['accountType', u8],
      ['openOrdersNonces', uniformFixedSizeArray(u8, 5)],
      ['openOrdersNoncesPadding', uniformFixedSizeArray(u8, 20)],
      ['rebalanceAmount', i64],
      ['lastFundingDeltas', uniformFixedSizeArray(anchorDecimalStruct, 5)],
      [
        'lastFundingDeltasPadding',
        uniformFixedSizeArray(anchorDecimalStruct, 20),
      ],
      ['productLedgers', uniformFixedSizeArray(productLedgerStruct, 5)],
      ['productLedgersPadding', uniformFixedSizeArray(productLedgerStruct, 20)],
      ['padding', uniformFixedSizeArray(u8, 2000)],
    ],
    (args) => args as CrossMarginAccount
  );
