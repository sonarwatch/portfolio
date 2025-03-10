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

export type SplAssetMarket = {
  marketPubkey: string;
  collateral: { mint: string; decimals: number; name: string };
};

export type Collection = {
  marketPubkey: string;
  collectionName: string;
  collectionImage: string;
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
  pairState?: string;
  onMarketVirtual?: string;
  onMarketTokenized?: string;
  frozen?: string;
  closed?: string;
  perpetualOnMarket?: string;
  perpetualClosed?: string;
  perpetualBondingCurveOnMarket?: string;
  perpetualMigrated?: string;
  perpetualBondingCurveClosed?: string;
  perpetualListing?: string;
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
  none?: string;
  autocompound?: string;
  receiveNftOnLiquidation?: string;
  autoreceiveSol?: string;
  autoCompoundAndReceiveNft?: string;
  autoReceiveAndReceiveNft?: string;
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
  notActive?: string;
  active?: string;
  perpetualActive?: string;
  perpetualRepaid?: string;
  perpetualLiquidatedByAuction?: string;
  perpetualLiquidatedByClaim?: string;
  perpetualManualTerminating?: string;
  perpetualPartialRepaid?: string;
  perpetualRefinanceRepaid?: string;
  perpetualRefinancedActive?: string;
  migrated?: string;
  perpetualBorrowerListing?: string;
  perpetualLenderListing?: string;
};

export type BondTradeTransactionV2Type = {
  none?: string;
  autocompound?: string;
  receiveNftOnLiquidation?: string;
  autoreceiveSol?: string;
  autoCompoundAndReceiveNft?: string;
  autoReceiveAndReceiveNft?: string;
};

export type RedeemResult = {
  none?: string;
  directBorrow?: string;
  reborrow?: string;
  instantRefinanced?: string;
  refinancedByAuction?: string;
  partialRepay?: string;
  directRepaid?: string;
  claimed?: string;
  directBorrowAndDirectRepaid?: string;
  directBorrowAndReborrowRepaid?: string;
  directBorrowAndInstantRefinancedRepaid?: string;
  directBorrowAndRefinancedByAuctionRepaid?: string;
  directBorrowAndPartialRepaid?: string;
  directBorrowAndClaimed?: string;
  reborrowAndDirectRepaid?: string;
  reborrowAndReborrowRepaid?: string;
  reborrowAndInstantRefinancedRepaid?: string;
  reborrowAndRefinancedByAuctionRepaid?: string;
  reborrowAndPartialRepaid?: string;
  reborrowAndClaimed?: string;
  instantRefinancedAndDirectRepaid?: string;
  instantRefinancedAndReborrowRepaid?: string;
  instantRefinancedAndInstantRefinancedRepaid?: string;
  instantRefinancedAndRefinancedByAuctionRepaid?: string;
  instantRefinancedAndPartialRepaid?: string;
  instantRefinancedAndClaimed?: string;
  refinancedByAuctionAndDirectRepaid?: string;
  refinancedByAuctionAndReborrowRepaid?: string;
  refinancedByAuctionAndInstantRefinancedRepaid?: string;
  refinancedByAuctionAndRefinancedByAuctionRepaid?: string;
  refinancedByAuctionAndPartialRepaid?: string;
  refinancedByAuctionAndClaimed?: string;
  partialRepaidAndDirectRepaid?: string;
  partialRepaidAndReborrowRepaid?: string;
  partialRepaidAndInstantRefinancedRepaid?: string;
  partialRepaidAndRefinancedByAuctionRepaid?: string;
  partialRepaidAndPartialRepaid?: string;
  partialRepaidAndClaimed?: string;
};

export type RepayDestination = {
  none?: string;
  offer?: string;
  wallet?: string;
  vault?: string;
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
  initialized?: string;
  active?: string;
  repaid?: string;
  liquidating?: string;
  liquidated?: string;
  perpetualActive?: string;
  perpetualRepaid?: string;
  perpetualLiquidatedByAuction?: string;
  perpetualLiquidatedByClaim?: string;
};
