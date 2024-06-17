export type BanxResponse = {
  data: Data;
};

export type Data = {
  banxWalletBalance: string;
  banxTokenStake: BanxTokenStake;
  banxAdventures: BanxAdventure[];
};

export type BanxAdventure = {
  adventure: Adventure;
  adventureSubscription: AdventureSubscription;
};

export type Adventure = {
  publicKey: string;
  adventureState: string;
  amountOfTokensHarvested: string;
  isRemoved: boolean;
  periodEndingAt: string;
  periodStartedAt: string;
  placeholderOne: string;
  rewardsToBeDistributed: string;
  tokensPerPoints: string;
  totalBanxSubscribed: string;
  totalPartnerPoints: string;
  totalPlayerPoints: string;
  totalTokensStaked: string;
  week: string;
};

export type AdventureSubscription = {
  publicKey: string;
  adventure: string;
  adventureSubscriptionState: string;
  amountOfTokensHarvested: string;
  banxTokenStake: string;
  createdAt: Date;
  harvestedAt: string;
  stakeNftAmount: string;
  stakePartnerPointsAmount: string;
  stakePlayerPointsAmount: string;
  stakeTokensAmount: string;
  subscribedAt: string;
  unsubscribedAt: string;
  updatedAt: Date;
  user: string;
};

export type BanxTokenStake = {
  _id: string;
  publicKey: string;
  adventureSubscriptionsQuantity: string;
  banxNftsStakedQuantity: string;
  banxStakeState: string;
  createdAt: Date;
  farmedAmount: string;
  isRemoved: boolean;
  nftsStakedAt: string;
  nftsUnstakedAt: string;
  partnerPointsStaked: string;
  placeholderOne: string;
  playerPointsStaked: string;
  stakedAt: string;
  tokensStaked: string;
  unstakedAt: string;
  updatedAt: Date;
  user: string;
};

export type Collection = {
  marketPubkey: string;
  collectionName: string;
  collectionFloor: number;
  tensorSlug: string;
};

export type BondOfferV2 = {
  hadoMarket: string;
  pairState: PairState;
  bondingCurve: BondOfferBondingCurve;
  baseSpotPrice: string;
  mathCounter: string;
  currentSpotPrice: string;
  concentrationIndex: string;
  bidCap: string;
  bidSettlement: string;
  edgeSettlement: string;
  fundsSolOrTokenBalance: string;
  buyOrdersQuantity: string;
  lastTransactedAt: string;
  assetReceiver: string;
  validation: BondOfferValidation;
};

export type PairState = {
  PairState?: string;
  OnMarketVirtual?: string;
  OnMarketTokenized?: string;
  Frozen?: string;
  Closed?: string;
  PerpetualOnMarket?: string;
  PerpetualClosed?: string;
  PerpetualBondingCurveOnMarket?: string;
  PerpetualMigrated?: string;
  PerpetualBondingCurveClosed?: string;
  PerpetualListing?: string;
};

export type BondOfferBondingCurve = {
  delta: number;
  bondingType: BondOfferBondingCurveType;
};

export type BondOfferBondingCurveType = {
  linear?: string;
  exponential?: string;
  linearUsdc?: string;
  exponentialUsdc?: string;
  linearBanxSol?: string;
  exponentialBanxSol?: string;
};

export type BondOfferValidation = {
  loanToValueFilter: number;
  durationFilter: number;
  maxReturnAmountFilter: number;
  bondFeatures: BondFeatures;
};

export type BondFeatures = {
  None?: string;
  Autocompound?: string;
  ReceiveNftOnLiquidation?: string;
  AutoreceiveSol?: string;
  AutoCompoundAndReceiveNft?: string;
  AutoReceiveAndReceiveNft?: string;
};

export type BondTradeTransactionV3 = {
  bondTradeTransactionState: BondTradeTransactionV2State;
  bondOffer: string;
  user: string;
  amountOfBonds: number;
  solAmount: number;
  feeAmount: number;
  bondTradeTransactionType: BondTradeTransactionV2Type;
  fbondTokenMint: string;
  soldAt: number;
  redeemedAt: string;
  redeemResult: RedeemResult;
  seller: string;
  isDirectSell: boolean;
  lendingToken: LendingTokenType;
  currentRemainingLent: number;
  interestSnapshot: number;
  partialRepaySnapshot: number;
  terminationStartedAt: number;
  lenderOriginalLent: number;
  lenderFullRepaidAmount: number;
  borrowerOriginalLent: number;
  borrowerFullRepaidAmount: number;
  repayDestination: RepayDestination;
  repaymentCallAmount: number;
  terminationFreeze: number;
  placeholder3: number;
  placeholder4: number;
  placeholder5: number;
  placeholder6: number;
  placeholder7: number;
  placeholder8: number;
};

export type BondTradeTransactionV2State = {
  NotActive?: string;
  Active?: string;
  PerpetualActive?: string;
  PerpetualRepaid?: string;
  PerpetualLiquidatedByAuction?: string;
  PerpetualLiquidatedByClaim?: string;
  PerpetualManualTerminating?: string;
  PerpetualPartialRepaid?: string;
  PerpetualRefinanceRepaid?: string;
  PerpetualRefinancedActive?: string;
  Migrated?: string;
  PerpetualBorrowerListing?: string;
  PerpetualLenderListing?: string;
};

export type BondTradeTransactionV2Type = {
  None?: string;
  Autocompound?: string;
  ReceiveNftOnLiquidation?: string;
  AutoreceiveSol?: string;
  AutoCompoundAndReceiveNft?: string;
  AutoReceiveAndReceiveNft?: string;
};

export type RedeemResult = {
  None?: string;
  DirectBorrow?: string;
  Reborrow?: string;
  InstantRefinanced?: string;
  RefinancedByAuction?: string;
  PartialRepay?: string;
  DirectRepaid?: string;
  Claimed?: string;
  DirectBorrowAndDirectRepaid?: string;
  DirectBorrowAndReborrowRepaid?: string;
  DirectBorrowAndInstantRefinancedRepaid?: string;
  DirectBorrowAndRefinancedByAuctionRepaid?: string;
  DirectBorrowAndPartialRepaid?: string;
  DirectBorrowAndClaimed?: string;
  ReborrowAndDirectRepaid?: string;
  ReborrowAndReborrowRepaid?: string;
  ReborrowAndInstantRefinancedRepaid?: string;
  ReborrowAndRefinancedByAuctionRepaid?: string;
  ReborrowAndPartialRepaid?: string;
  ReborrowAndClaimed?: string;
  InstantRefinancedAndDirectRepaid?: string;
  InstantRefinancedAndReborrowRepaid?: string;
  InstantRefinancedAndInstantRefinancedRepaid?: string;
  InstantRefinancedAndRefinancedByAuctionRepaid?: string;
  InstantRefinancedAndPartialRepaid?: string;
  InstantRefinancedAndClaimed?: string;
  RefinancedByAuctionAndDirectRepaid?: string;
  RefinancedByAuctionAndReborrowRepaid?: string;
  RefinancedByAuctionAndInstantRefinancedRepaid?: string;
  RefinancedByAuctionAndRefinancedByAuctionRepaid?: string;
  RefinancedByAuctionAndPartialRepaid?: string;
  RefinancedByAuctionAndClaimed?: string;
  PartialRepaidAndDirectRepaid?: string;
  PartialRepaidAndReborrowRepaid?: string;
  PartialRepaidAndInstantRefinancedRepaid?: string;
  PartialRepaidAndRefinancedByAuctionRepaid?: string;
  PartialRepaidAndPartialRepaid?: string;
  PartialRepaidAndClaimed?: string;
};

export type RepayDestination = {
  None?: string;
  Offer?: string;
  Wallet?: string;
  Vault?: string;
};

export type LendingTokenType = {
  nativeSol?: string;
  usdc?: string;
  banxSol?: string;
};

export type FraktBond = {
  fraktBondState: FraktBondState;
  bondTradeTransactionsCounter: number;
  borrowedAmount: number;
  banxStake: string;
  fraktMarket: string;
  hadoMarket?: string;
  amountToReturn: number;
  actualReturnedAmount: number;
  terminatedCounter: number;
  fbondTokenMint: string;
  fbondTokenSupply: number;
  activatedAt: number;
  liquidatingAt: number;
  fbondIssuer: string;
  repaidOrLiquidatedAt: number;
  currentPerpetualBorrowed: number;
  lastTransactedAt: number;
  refinanceAuctionStartedAt: number;
};

export type FraktBondState = {
  Initialized?: string;
  Active?: string;
  Repaid?: string;
  Liquidating?: string;
  Liquidated?: string;
  PerpetualActive?: string;
  PerpetualRepaid?: string;
  PerpetualLiquidatedByAuction?: string;
  PerpetualLiquidatedByClaim?: string;
};
