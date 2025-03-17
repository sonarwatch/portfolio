import {
  BeetStruct,
  bool,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { i64, u128, u64 } from '../../utils/solana';

export enum BanxTokenStakeState {
  None,
  Staked,
  Unstaked,
}

export type BanxTokenStake = {
  accountDiscriminator: number[];
  banxStakeState: BanxTokenStakeState;
  user: PublicKey;
  adventureSubscriptionsQuantity: BigNumber;
  tokensStaked: BigNumber;
  partnerPointsStaked: BigNumber;
  playerPointsStaked: BigNumber;
  banxNftsStakedQuantity: BigNumber;
  stakedAt: BigNumber;
  unstakedAt: BigNumber;
  farmedAmount: BigNumber;
  nftsStakedAt: BigNumber;
  nftsUnstakedAt: BigNumber;
  placeholderOne: PublicKey;
};

export enum Bondtradetransactionv2type {
  None = 0,
  Autocompound = 1,
  Receivenftonliquidation = 2,
  Autoreceivesol = 3,
  Autocompoundandreceivenft = 4,
  Autoreceiveandreceivenft = 5,
  Autoreceiveandreceivespl = 6,
}

export enum BondtradeTransactionv2State {
  Notactive = 0,
  Active = 1,
  Perpetualactive = 2,
  Perpetualrepaid = 3,
  Perpetualliquidatedbyauction = 4,
  Perpetualliquidatedbyclaim = 5,
  Perpetualmanualterminating = 6,
  Perpetualpartialrepaid = 7,
  Perpetualrefinancerepaid = 8,
  Perpetualrefinancedactive = 9,
  Migrated = 10,
  Perpetualborrowerlisting = 11,
  Perpetuallenderlisting = 12,
  Perpetualsellingloan = 13,
  Perpetualsellinglisting = 14,
  Perpetualsellinglistingclosed = 15,
  Perpetualaddcollateralclosed = 16,
}

export enum RedeemResult {
  None = 0,
  Directborrow = 1,
  Reborrow = 2,
  Instantrefinanced = 3,
  Refinancedbyauction = 4,
  Partialrepay = 5,
  Directrepaid = 6,
  Claimed = 7,
  Addcollateral = 8,
}

export enum LendingTokenType {
  Nativesol = 0,
  Usdc = 1,
  Banxsol = 2,
}

export enum RepayDestination {
  None = 0,
  Offer = 1,
  Wallet = 2,
  Vault = 3,
}

export enum PairState {
  Initializing = 0,
  Onmarketvirtual = 1,
  Onmarkettokenized = 2,
  Frozen = 3,
  Closed = 4,
  Perpetualonmarket = 5,
  Perpetualclosed = 6,
  Perpetualbondingcurveonmarket = 7,
  Perpetualmigrated = 8,
  Perpetualbondingcurveclosed = 9,
  Perpetuallisting = 10,
}

export enum BondOfferBondingCurveType {
  Linear = 0,
  Exponential = 1,
  Linearusdc = 2,
  Exponentialusdc = 3,
  Linearbanxsol = 4,
  Exponentialbanxsol = 5,
}

export type BondOfferBondingCurve = {
  delta: BigNumber;
  bondingType: BondOfferBondingCurveType;
};

export enum BondFeatures {
  None = 0,
  Autocompound = 1,
  Receivenftonliquidation = 2,
  Autoreceivesol = 3,
  Autocompoundandreceivenft = 4,
  Autoreceiveandreceivenft = 5,
  Autoreceiveandreceivespl = 6,
}

export type BondOfferValidation = {
  loanToValueFilter: BigNumber;
  collateralsPerToken: BigNumber;
  maxReturnAmountFilter: BigNumber;
  bondFeatures: BondFeatures;
};

export const banxTokenStakeStruct = new BeetStruct<BanxTokenStake>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['banxStakeState', u8],
    ['user', publicKey],
    ['adventureSubscriptionsQuantity', u64],
    ['tokensStaked', u64],
    ['partnerPointsStaked', u64],
    ['playerPointsStaked', u64],
    ['banxNftsStakedQuantity', u64],
    ['stakedAt', u64],
    ['unstakedAt', u64],
    ['farmedAmount', u64],
    ['nftsStakedAt', u64],
    ['nftsUnstakedAt', u64],
    ['placeholderOne', publicKey],
  ],
  (args) => args as BanxTokenStake
);

export type BondTradeTransactionv3 = {
  accountDiscriminator: number[];
  bondTradeTransactionState: BondtradeTransactionv2State;
  bondOffer: PublicKey;
  user: PublicKey;
  amountOfBonds: BigNumber;
  solAmount: BigNumber;
  feeAmount: BigNumber;
  bondTradeTransactionType: Bondtradetransactionv2type;
  fbondTokenMint: PublicKey;
  soldAt: BigNumber;
  redeemedAt: BigNumber;
  redeemResult: RedeemResult;
  seller: PublicKey;
  isDirectSell: boolean;
  lendingToken: LendingTokenType;
  currentRemainingLent: BigNumber;
  interestSnapshot: BigNumber;
  partialRepaySnapshot: BigNumber;
  terminationStartedAt: BigNumber;
  lenderOriginalLent: BigNumber;
  lenderFullRepaidAmount: BigNumber;
  borrowerOriginalLent: BigNumber;
  borrowerFullRepaidAmount: BigNumber;
  repayDestination: RepayDestination;
  repaymentCallAmount: BigNumber;
  terminationFreeze: BigNumber;
  redeemResultNext: RedeemResult;
  protocolInterestFee: number;
  collateralAmountSnapshot: BigNumber;
  placeholder1: number;
  placeholder2: number;
  placeholder3: number;
  placeholder4: BigNumber;
  placeholder5: BigNumber;
  placeholder6: BigNumber;
  placeholder7: PublicKey;
};

export const Bondtradetransactionv3Struct =
  new BeetStruct<BondTradeTransactionv3>(
    [
      ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
      ['bondTradeTransactionState', u8],
      ['bondOffer', publicKey],
      ['user', publicKey],
      ['amountOfBonds', u64],
      ['solAmount', u64],
      ['feeAmount', u64],
      ['bondTradeTransactionType', u8],
      ['fbondTokenMint', publicKey],
      ['soldAt', u64],
      ['redeemedAt', u64],
      ['redeemResult', u8],
      ['seller', publicKey],
      ['isDirectSell', bool],
      ['lendingToken', u8],
      ['currentRemainingLent', u64],
      ['interestSnapshot', u64],
      ['partialRepaySnapshot', u64],
      ['terminationStartedAt', u64],
      ['lenderOriginalLent', u64],
      ['lenderFullRepaidAmount', u64],
      ['borrowerOriginalLent', u64],
      ['borrowerFullRepaidAmount', u64],
      ['repayDestination', u8],
      ['repaymentCallAmount', u64],
      ['terminationFreeze', u64],
      ['redeemResultNext', u8],
      ['protocolInterestFee', u32],
      ['collateralAmountSnapshot', u64],
      ['placeholder1', u8],
      ['placeholder2', u8],
      ['placeholder3', u8],
      ['placeholder4', u64],
      ['placeholder5', u64],
      ['placeholder6', u64],
      ['placeholder7', publicKey],
    ],
    (args) => args as BondTradeTransactionv3
  );

export type BondOfferv3 = {
  accountDiscriminator: number[];
  hadoMarket: PublicKey;
  pairState: PairState;
  bondingCurve: BondOfferBondingCurve;
  baseSpotPrice: BigNumber;
  mathCounter: BigNumber;
  currentSpotPrice: BigNumber;
  concentrationIndex: BigNumber;
  bidCap: BigNumber;
  bidSettlement: BigNumber;
  edgeSettlement: BigNumber;
  fundsSolOrTokenBalance: BigNumber;
  buyOrdersQuantity: BigNumber;
  lastTransactedAt: BigNumber;
  assetReceiver: PublicKey;
  validation: BondOfferValidation;
  liquidationLtvBp: BigNumber;
  offerLtvBp: BigNumber;
  placeholder3: BigNumber;
  placeholder4: BigNumber;
  placeholder5: BigNumber;
  placeholder6: BigNumber;
  loanApr: BigNumber;
  placeholder7: PublicKey;
};

export const bondOfferBondingCurveStruct =
  new BeetStruct<BondOfferBondingCurve>(
    [
      ['delta', u64],
      ['bondingType', u8],
    ],
    (args) => args as BondOfferBondingCurve
  );

export const bondOfferv3Struct = new BeetStruct<BondOfferv3>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['hadoMarket', publicKey],
    ['pairState', u8],
    ['bondingCurve', bondOfferBondingCurveStruct],
    ['baseSpotPrice', u64],
    ['mathCounter', i64],
    ['currentSpotPrice', u64],
    ['concentrationIndex', u64],
    ['bidCap', u64],
    ['bidSettlement', i64],
    ['edgeSettlement', u64],
    ['fundsSolOrTokenBalance', u64],
    ['buyOrdersQuantity', u64],
    ['lastTransactedAt', u64],
    ['assetReceiver', publicKey],
    ['validation', u8],
    ['liquidationLtvBp', u64],
    ['offerLtvBp', u64],
    ['placeholder3', u64],
    ['placeholder4', u64],
    ['placeholder5', u64],
    ['placeholder6', u64],
    ['loanApr', u64],
    ['placeholder7', publicKey],
  ],
  (args) => args as BondOfferv3
);

export enum Fraktbondstate {
  Initialized = 0,
  Active = 1,
  Repaid = 2,
  Liquidating = 3,
  Liquidated = 4,
  Perpetualactive = 5,
  Perpetualrepaid = 6,
  Perpetualliquidatedbyauction = 7,
  Perpetualliquidatedbyclaim = 8,
}

export type Fraktbond = {
  accountDiscriminator: number[];
  fraktBondState: Fraktbondstate;
  bondTradeTransactionsCounter: number;
  borrowedAmount: BigNumber;
  banxStake: PublicKey;
  fraktMarket: PublicKey;
  leverageBasePoints: BigNumber;
  actualReturnedAmount: BigNumber;
  terminatedCounter: number;
  fbondTokenMint: PublicKey;
  fbondTokenSupply: BigNumber;
  activatedAt: BigNumber;
  liquidatingAt: BigNumber;
  fbondIssuer: PublicKey;
  repaidOrLiquidatedAt: BigNumber;
  currentPerpetualBorrowed: BigNumber;
  lastTransactedAt: BigNumber;
  refinanceAuctionStartedAt: BigNumber;
};

export const FraktbondStruct = new BeetStruct<Fraktbond>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['fraktBondState', u8],
    ['bondTradeTransactionsCounter', u8],
    ['borrowedAmount', u64],
    ['banxStake', publicKey],
    ['fraktMarket', publicKey],
    ['leverageBasePoints', u64],
    ['actualReturnedAmount', u64],
    ['terminatedCounter', u8],
    ['fbondTokenMint', publicKey],
    ['fbondTokenSupply', u64],
    ['activatedAt', u64],
    ['liquidatingAt', u64],
    ['fbondIssuer', publicKey],
    ['repaidOrLiquidatedAt', u64],
    ['currentPerpetualBorrowed', u64],
    ['lastTransactedAt', u64],
    ['refinanceAuctionStartedAt', u64],
  ],
  (args) => args as Fraktbond
);

export type BanxPool = {
  accountDiscriminator: number[];
};

export const banxPoolStruct = new BeetStruct<BanxPool>(
  [['accountDiscriminator', uniformFixedSizeArray(u8, 8)]],
  (args) => args as BanxPool
);

export type BanxPoolMarketSettings = {
  accountDiscriminator: number[];
};

export const banxPoolMarketSettingsStruct =
  new BeetStruct<BanxPoolMarketSettings>(
    [['accountDiscriminator', uniformFixedSizeArray(u8, 8)]],
    (args) => args as BanxPoolMarketSettings
  );

export enum BanxPoolUserDepositState {
  None = 0,
  Active = 1,
  Closed = 2,
}

export type BanxPoolUserDeposit = {
  accountDiscriminator: number[];
  userDepositState: BanxPoolUserDepositState;
  banxPool: PublicKey;
  user: PublicKey;
  depositAmount: BigNumber;
  depositedAt: BigNumber;
  depositedAtCumulative: BigNumber;
  requestedWithdrawAmount: BigNumber;
  rewardsHarvested: BigNumber;
  lastTransactedAt: BigNumber;
  lossCumulative: BigNumber;
  totalLossAmount: BigNumber;
  placeholder1: BigNumber;
  placeholder2: BigNumber;
  placeholder3: BigNumber;
  placeholder4: PublicKey;
};

export const banxPoolUserDepositStruct = new BeetStruct<BanxPoolUserDeposit>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['userDepositState', u8],
    ['banxPool', publicKey],
    ['user', publicKey],
    ['depositAmount', u128],
    ['depositedAt', u64],
    ['depositedAtCumulative', u128],
    ['requestedWithdrawAmount', u128],
    ['rewardsHarvested', u128],
    ['lastTransactedAt', u64],
    ['lossCumulative', u64],
    ['totalLossAmount', u64],
    ['placeholder1', u64],
    ['placeholder2', u64],
    ['placeholder3', u64],
    ['placeholder4', publicKey],
  ],
  (args) => args as BanxPoolUserDeposit
);
