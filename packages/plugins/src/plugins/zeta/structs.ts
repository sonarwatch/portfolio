import {
  BeetStruct,
  FixableBeetStruct,
  bool,
  u32,
  u8,
  uniformFixedSizeArray,
  FixableBeet,
  DataEnumKeyAsKind,
  dataEnum,
  FixableBeetArgsStruct,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
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

export type ClaimStatus = {
  buffer: Buffer;
  claimant: PublicKey;
  claimedAt: BigNumber;
  claimedAmount: BigNumber;
};

export const claimStatusStruct = new BeetStruct<ClaimStatus>(
  [
    ['buffer', blob(8)],
    ['claimant', publicKey],
    ['claimedAt', u64],
    ['claimedAmount', u64],
  ],
  (args) => args as ClaimStatus
);

type StakeStateRecord = {
  Uninitialized: NonNullable<unknown>;
  Vesting: {
    stakeStartEpoch: number;
    lastClaimTs: BigNumber;
  };
  Locked: NonNullable<unknown>;
};
type StakeState = DataEnumKeyAsKind<StakeStateRecord>;

const stakeStateStruct = dataEnum<StakeStateRecord>([
  [
    'Uninitialized',
    new FixableBeetArgsStruct<StakeStateRecord['Uninitialized']>(
      [],
      'StakeStateRecord["Uninitialized"]'
    ),
  ],
  [
    'Vesting',
    new FixableBeetArgsStruct<StakeStateRecord['Vesting']>(
      [
        ['stakeStartEpoch', u32],
        ['lastClaimTs', u64],
      ],
      'StakeStateRecord["Vesting"]'
    ),
  ],
  [
    'Locked',
    new FixableBeetArgsStruct<StakeStateRecord['Locked']>(
      [],
      'StakeStateRecord["Locked"]'
    ),
  ],
]) as FixableBeet<StakeState>;

export type StakeAccount = {
  accountDiscriminator: number[];
  name: number[];
  vaultNonce: number;
  bitInUse: number;
  stakeState: StakeState;
  initialStakeAmount: BigNumber;
  amountStillStaked: BigNumber;
  amountClaimed: BigNumber;
  stakeDurationEpochs: number;
  authority: PublicKey;
};

export const stakeAccountStruct = new FixableBeetStruct<StakeAccount>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['name', uniformFixedSizeArray(u8, 10)],
    ['vaultNonce', u8],
    ['bitInUse', u8],
    ['stakeState', stakeStateStruct],
    ['initialStakeAmount', u64],
    ['amountStillStaked', u64],
    ['amountClaimed', u64],
    ['stakeDurationEpochs', u32],
    ['authority', publicKey], // 49
  ],
  (args) => args as StakeAccount
);
