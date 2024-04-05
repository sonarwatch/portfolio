import { PublicKey } from '@solana/web3.js';
import {
  BeetStruct,
  FixableBeetStruct,
  i32,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../../utils/solana';

// https://github.com/hubbleprotocol/hubble-common/blob/master/packages/hubble-idl/src/kamino.json

export type Price = {
  value: BigNumber;
  exp: BigNumber;
};

export const priceStruct = new BeetStruct<Price>(
  [
    ['value', u64],
    ['exp', u64],
  ],
  (args) => args as Price
);

export type CollateralInfo = {
  mint: PublicKey;
  lowerHeuristic: BigNumber;
  upperHeuristic: BigNumber;
  expHeuristic: BigNumber;
  maxTwapDivergenceBps: BigNumber;
  scopePriceIdTwap: BigNumber;
  scopePriceChain: number[];
  name: number[];
  maxAgePriceSeconds: BigNumber;
  maxAgeTwapSeconds: BigNumber;
  maxIgnorableAmountAsReward: BigNumber;
  disabled: number;
  padding0: number[];
  padding: BigNumber[];
};

export const collateralInfoStruct = new BeetStruct<CollateralInfo>(
  [
    ['mint', publicKey],
    ['lowerHeuristic', u64],
    ['upperHeuristic', u64],
    ['expHeuristic', u64],
    ['maxTwapDivergenceBps', u64],
    ['scopePriceIdTwap', u64],
    ['scopePriceChain', uniformFixedSizeArray(u16, 4)],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['maxAgePriceSeconds', u64],
    ['maxAgeTwapSeconds', u64],
    ['maxIgnorableAmountAsReward', u64],
    ['disabled', u8],
    ['padding0', uniformFixedSizeArray(u8, 7)],
    ['padding', uniformFixedSizeArray(u64, 9)],
  ],
  (args) => args as CollateralInfo
);

export type CollateralInfos = {
  infos: CollateralInfo[];
};

export const collateralInfosStruct = new FixableBeetStruct<CollateralInfos>(
  [['infos', uniformFixedSizeArray(collateralInfoStruct, 256)]],
  (args) => args as CollateralInfos
);

export type ScopeChainAccount = {
  chainArray: number[][];
};

export const scopeChainAccountStruct = new FixableBeetStruct<ScopeChainAccount>(
  [['chainArray', uniformFixedSizeArray(uniformFixedSizeArray(u16, 4), 512)]],
  (args) => args as ScopeChainAccount
);

export type TermsSignature = {
  signature: number[];
};

export const termsSignatureStruct = new BeetStruct<TermsSignature>(
  [['signature', uniformFixedSizeArray(u8, 64)]],
  (args) => args as TermsSignature
);

export type WithdrawalCaps = {
  configCapacity: BigNumber;
  currentTotal: BigNumber;
  lastIntervalStartTimestamp: BigNumber;
  configIntervalLengthSeconds: BigNumber;
};

export const withdrawalCapsStruct = new BeetStruct<WithdrawalCaps>(
  [
    ['configCapacity', i64],
    ['currentTotal', i64],
    ['lastIntervalStartTimestamp', u64],
    ['configIntervalLengthSeconds', u64],
  ],
  (args) => args as WithdrawalCaps
);

export type KaminoRewardInfo = {
  decimals: BigNumber;
  rewardVault: PublicKey;
  rewardMint: PublicKey;
  rewardCollateralId: BigNumber;
  lastIssuanceTs: BigNumber;
  rewardPerSecond: BigNumber;
  amountUncollected: BigNumber;
  amountIssuedCumulative: BigNumber;
  amountAvailable: BigNumber;
};

export const kaminoRewardInfoStruct = new BeetStruct<KaminoRewardInfo>(
  [
    ['decimals', u64],
    ['rewardVault', publicKey],
    ['rewardMint', publicKey],
    ['rewardCollateralId', u64],
    ['lastIssuanceTs', u64],
    ['rewardPerSecond', u64],
    ['amountUncollected', u64],
    ['amountIssuedCumulative', u64],
    ['amountAvailable', u64],
  ],
  (args) => args as KaminoRewardInfo
);

export type RebalanceRaw = {
  params: number[];
  state: number[];
  referencePriceType: number;
};

export const rebalanceRawStruct = new BeetStruct<RebalanceRaw>(
  [
    ['params', uniformFixedSizeArray(u8, 128)],
    ['state', uniformFixedSizeArray(u8, 256)],
    ['referencePriceType', u8],
  ],
  (args) => args as RebalanceRaw
);

export type WhirlpoolStrategy = {
  buffer: Buffer;
  adminAuthority: PublicKey;
  globalConfig: PublicKey;
  baseVaultAuthority: PublicKey;
  baseVaultAuthorityBump: BigNumber;
  pool: PublicKey;
  poolTokenVaultA: PublicKey;
  poolTokenVaultB: PublicKey;
  tickArrayLower: PublicKey;
  tickArrayUpper: PublicKey;
  position: PublicKey;
  positionMint: PublicKey;
  positionMetadata: PublicKey;
  positionTokenAccount: PublicKey;
  tokenAVault: PublicKey;
  tokenBVault: PublicKey;
  tokenAVaultAuthority: PublicKey;
  tokenBVaultAuthority: PublicKey;
  tokenAVaultAuthorityBump: BigNumber;
  tokenBVaultAuthorityBump: BigNumber;
  tokenAMint: PublicKey;
  tokenBMint: PublicKey;
  tokenAMintDecimals: BigNumber;
  tokenBMintDecimals: BigNumber;
  tokenAAmounts: BigNumber;
  tokenBAmounts: BigNumber;
  tokenACollateralId: BigNumber;
  tokenBCollateralId: BigNumber;
  scopePrices: PublicKey;
  scopeProgram: PublicKey;
  sharesMint: PublicKey;
  sharesMintDecimals: BigNumber;
  sharesMintAuthority: PublicKey;
  sharesMintAuthorityBump: BigNumber;
  sharesIssued: BigNumber;
  status: BigNumber;
  reward0Amount: BigNumber;
  reward0Vault: PublicKey;
  reward0CollateralId: BigNumber;
  reward0Decimals: BigNumber;
  reward1Amount: BigNumber;
  reward1Vault: PublicKey;
  reward1CollateralId: BigNumber;
  reward1Decimals: BigNumber;
  reward2Amount: BigNumber;
  reward2Vault: PublicKey;
  reward2CollateralId: BigNumber;
  reward2Decimals: BigNumber;
  depositCapUsd: BigNumber;
  feesACumulative: BigNumber;
  feesBCumulative: BigNumber;
  reward0AmountCumulative: BigNumber;
  reward1AmountCumulative: BigNumber;
  reward2AmountCumulative: BigNumber;
  depositCapUsdPerIxn: BigNumber;
  withdrawalCapA: WithdrawalCaps;
  withdrawalCapB: WithdrawalCaps;
  maxPriceDeviationBps: BigNumber;
  swapVaultMaxSlippageBps: BigNumber;
  swapVaultMaxSlippageFromReferenceBps: BigNumber;
  strategyType: BigNumber;
  depositFee: BigNumber;
  withdrawFee: BigNumber;
  feesFee: BigNumber;
  reward0Fee: BigNumber;
  reward1Fee: BigNumber;
  reward2Fee: BigNumber;
  positionTimestamp: BigNumber;
  kaminoRewards: KaminoRewardInfo[];
  strategyDex: BigNumber;
  raydiumProtocolPositionOrBaseVaultAuthority: PublicKey;
  allowDepositWithoutInvest: BigNumber;
  raydiumPoolConfigOrBaseVaultAuthority: PublicKey;
  depositBlocked: number;
  creationStatus: number;
  investBlocked: number;
  shareCalculationMethod: number;
  withdrawBlocked: number;
  reservedFlag2: number;
  localAdminBlocked: number;
  flashVaultSwapAllowed: number;
  referenceSwapPriceA: Price;
  referenceSwapPriceB: Price;
  isCommunity: number;
  rebalanceType: number;
  padding0: number[];
  rebalanceRaw: RebalanceRaw;
  padding1: number[];
  tokenAFeesFromRewardsCumulative: BigNumber;
  tokenBFeesFromRewardsCumulative: BigNumber;
  strategyLookupTable: PublicKey;
  padding3: BigNumber[];
  padding4: BigNumber[];
  padding5: BigNumber[];
  padding6: BigNumber[];
};

export const whirlpoolStrategyStruct = new BeetStruct<WhirlpoolStrategy>(
  [
    ['buffer', blob(8)],
    ['adminAuthority', publicKey],
    ['globalConfig', publicKey],
    ['baseVaultAuthority', publicKey],
    ['baseVaultAuthorityBump', u64],
    ['pool', publicKey],
    ['poolTokenVaultA', publicKey],
    ['poolTokenVaultB', publicKey],
    ['tickArrayLower', publicKey],
    ['tickArrayUpper', publicKey],
    ['position', publicKey],
    ['positionMint', publicKey],
    ['positionMetadata', publicKey],
    ['positionTokenAccount', publicKey],
    ['tokenAVault', publicKey],
    ['tokenBVault', publicKey],
    ['tokenAVaultAuthority', publicKey],
    ['tokenBVaultAuthority', publicKey],
    ['tokenAVaultAuthorityBump', u64],
    ['tokenBVaultAuthorityBump', u64],
    ['tokenAMint', publicKey],
    ['tokenBMint', publicKey],
    ['tokenAMintDecimals', u64],
    ['tokenBMintDecimals', u64],
    ['tokenAAmounts', u64],
    ['tokenBAmounts', u64],
    ['tokenACollateralId', u64],
    ['tokenBCollateralId', u64],
    ['scopePrices', publicKey],
    ['scopeProgram', publicKey],
    ['sharesMint', publicKey],
    ['sharesMintDecimals', u64],
    ['sharesMintAuthority', publicKey],
    ['sharesMintAuthorityBump', u64],
    ['sharesIssued', u64],
    ['status', u64],
    ['reward0Amount', u64],
    ['reward0Vault', publicKey],
    ['reward0CollateralId', u64],
    ['reward0Decimals', u64],
    ['reward1Amount', u64],
    ['reward1Vault', publicKey],
    ['reward1CollateralId', u64],
    ['reward1Decimals', u64],
    ['reward2Amount', u64],
    ['reward2Vault', publicKey],
    ['reward2CollateralId', u64],
    ['reward2Decimals', u64],
    ['depositCapUsd', u64],
    ['feesACumulative', u64],
    ['feesBCumulative', u64],
    ['reward0AmountCumulative', u64],
    ['reward1AmountCumulative', u64],
    ['reward2AmountCumulative', u64],
    ['depositCapUsdPerIxn', u64],
    ['withdrawalCapA', withdrawalCapsStruct],
    ['withdrawalCapB', withdrawalCapsStruct],
    ['maxPriceDeviationBps', u64],
    ['swapVaultMaxSlippageBps', u32],
    ['swapVaultMaxSlippageFromReferenceBps', u32],
    ['strategyType', u64],
    ['depositFee', u64],
    ['withdrawFee', u64],
    ['feesFee', u64],
    ['reward0Fee', u64],
    ['reward1Fee', u64],
    ['reward2Fee', u64],
    ['positionTimestamp', u64],
    ['kaminoRewards', uniformFixedSizeArray(kaminoRewardInfoStruct, 3)],
    ['strategyDex', u64],
    ['raydiumProtocolPositionOrBaseVaultAuthority', publicKey],
    ['allowDepositWithoutInvest', u64],
    ['raydiumPoolConfigOrBaseVaultAuthority', publicKey],
    ['depositBlocked', u8],
    ['creationStatus', u8],
    ['investBlocked', u8],
    ['shareCalculationMethod', u8],
    ['withdrawBlocked', u8],
    ['reservedFlag2', u8],
    ['localAdminBlocked', u8],
    ['flashVaultSwapAllowed', u8],
    ['referenceSwapPriceA', priceStruct],
    ['referenceSwapPriceB', priceStruct],
    ['isCommunity', u8],
    ['rebalanceType', u8],
    ['padding0', uniformFixedSizeArray(u8, 6)],
    ['rebalanceRaw', rebalanceRawStruct],
    ['padding1', uniformFixedSizeArray(u8, 7)],
    ['tokenAFeesFromRewardsCumulative', u64],
    ['tokenBFeesFromRewardsCumulative', u64],
    ['strategyLookupTable', publicKey],
    ['padding3', uniformFixedSizeArray(u128, 26)],
    ['padding4', uniformFixedSizeArray(u128, 32)],
    ['padding5', uniformFixedSizeArray(u128, 32)],
    ['padding6', uniformFixedSizeArray(u128, 32)],
  ],
  (args) => args as WhirlpoolStrategy
);

export type ProtocolPositionState = {
  buffer: Buffer;
  bump: number;
  poolId: PublicKey;
  tickLowerIndex: BigNumber;
  tickUpperIndex: BigNumber;
  liquidity: BigNumber;
  feeGrowthInside0LastX64: BigNumber;
  feeGrowthInside1LastX64: BigNumber;
  tokenFeesOwed0: BigNumber;
  tokenFeesOwed1: BigNumber;
  rewardGrowthInside: BigNumber[];
  padding: BigNumber[];
};
export const protocolPositionStateStruct =
  new BeetStruct<ProtocolPositionState>(
    [
      ['buffer', blob(8)],
      ['bump', u8],
      ['poolId', publicKey],
      ['tickLowerIndex', i32],
      ['tickUpperIndex', i32],
      ['liquidity', u128],
      ['feeGrowthInside0LastX64', u128],
      ['feeGrowthInside1LastX64', u128],
      ['tokenFeesOwed0', u64],
      ['tokenFeesOwed1', u64],
      ['rewardGrowthInside', uniformFixedSizeArray(u128, 3)],
      ['padding', uniformFixedSizeArray(u64, 8)],
    ],
    (args) => args as ProtocolPositionState
  );

export type UserState = {
  buffer: Buffer;
  userId: BigNumber;
  farmState: PublicKey;
  owner: PublicKey;
  legacyStake: BigNumber;
  rewardsTallyScaled: BigNumber[];
  rewardsIssuedUnclaimed: BigNumber[];
  lastClaimTs: BigNumber[];
  activeStakeScaled: BigNumber;
  pendingDepositStakeScaled: BigNumber;
  pendingDepositStakeTs: BigNumber;
  pendingWithdrawalUnstakeScaled: BigNumber;
  pendingWithdrawalUnstakeTs: BigNumber;
  bump: BigNumber;
  delegatee: PublicKey;
  lastStakeTs: BigNumber;
  padding: BigNumber[];
};

export const userStateStruct = new BeetStruct<UserState>(
  [
    ['buffer', blob(8)],
    ['userId', u64],
    ['farmState', publicKey],
    ['owner', publicKey],
    ['legacyStake', u64],
    ['rewardsTallyScaled', uniformFixedSizeArray(u128, 10)],
    ['rewardsIssuedUnclaimed', uniformFixedSizeArray(u64, 10)],
    ['lastClaimTs', uniformFixedSizeArray(u64, 10)],
    ['activeStakeScaled', u128],
    ['pendingDepositStakeScaled', u128],
    ['pendingDepositStakeTs', u64],
    ['pendingWithdrawalUnstakeScaled', u128],
    ['pendingWithdrawalUnstakeTs', u64],
    ['bump', u64],
    ['delegatee', publicKey],
    ['lastStakeTs', u64],
    ['padding', uniformFixedSizeArray(u64, 50)],
  ],
  (args) => args as UserState
);

export type TokenInfo = {
  mint: PublicKey;
  decimals: BigNumber;
  padding: BigNumber[];
};

export const tokenInfoStruct = new BeetStruct<TokenInfo>(
  [
    ['mint', publicKey],
    ['decimals', u64],
    ['padding', uniformFixedSizeArray(u64, 10)],
  ],
  (args) => args as TokenInfo
);

export type RewardPerTimeUnitPoint = {
  tsStart: BigNumber;
  rewardPerTimeUnit: BigNumber;
};

export const rewardPerTimeUnitPointStruct = new BeetStruct(
  [
    ['tsStart', u64],
    ['rewardPerTimeUnit', u64],
  ],
  (args) => args as RewardPerTimeUnitPoint
);

export type RewardScheduleCurve = {
  points: RewardPerTimeUnitPoint[];
};

export const rewardScheduleCurveStruct = new BeetStruct<RewardScheduleCurve>(
  [['points', uniformFixedSizeArray(rewardPerTimeUnitPointStruct, 20)]],
  (args) => args as RewardScheduleCurve
);

export type RewardInfo = {
  token: TokenInfo;
  rewardsVault: PublicKey;
  rewardsAvailable: BigNumber;
  rewardScheduleCurve: RewardScheduleCurve;
  minClaimDurationSeconds: BigNumber;
  lastIssuanceTs: BigNumber;
  rewardsIssuedUnclaimed: BigNumber;
  rewardsIssuedCumulative: BigNumber;
  rewardPerShareScaled: BigNumber;
  placeholder0: BigNumber;
  rewardType: number;
  rewardsPerSecondDecimals: number;
  padding0: number[];
  padding1: BigNumber[];
};

export const rewardInfoStruct = new BeetStruct<RewardInfo>(
  [
    ['token', tokenInfoStruct],
    ['rewardsVault', publicKey],
    ['rewardsAvailable', u64],
    ['rewardScheduleCurve', rewardScheduleCurveStruct],
    ['minClaimDurationSeconds', u64],
    ['lastIssuanceTs', u64],
    ['rewardsIssuedUnclaimed', u64],
    ['rewardsIssuedCumulative', u64],
    ['rewardPerShareScaled', u128],
    ['placeholder0', u64],
    ['rewardType', u8],
    ['rewardsPerSecondDecimals', u8],
    ['padding0', uniformFixedSizeArray(u8, 6)],
    ['padding1', uniformFixedSizeArray(u64, 20)],
  ],
  (args) => args as RewardInfo
);

export type FarmState = {
  buffer: Buffer;
  farmAdmin: PublicKey;
  globalConfig: PublicKey;
  token: TokenInfo;
  rewardInfos: RewardInfo[];
  numRewardTokens: BigNumber;
  numUsers: BigNumber;
  totalStakedAmount: BigNumber;
  farmVault: PublicKey;
  farmVaultsAuthority: PublicKey;
  farmVaultsAuthorityBump: BigNumber;
  delegateAuthority: PublicKey;
  timeUnit: number;
  padding0: number[];
  withdrawAuthority: PublicKey;
  depositWarmupPeriod: BigNumber;
  withdrawalCooldownPeriod: BigNumber;
  totalActiveStakeScaled: BigNumber;
  totalPendingStakeScaled: BigNumber;
  totalPendingAmount: BigNumber;
  slashedAmountCurrent: BigNumber;
  slashedAmountCumulative: BigNumber;
  slashedAmountSpillAddress: PublicKey;
  lockingMode: BigNumber;
  lockingStartTimestamp: BigNumber;
  lockingDuration: BigNumber;
  lockingEarlyWithdrawalPenaltyBps: BigNumber;
  depositCapAmount: BigNumber;
  scopePrices: PublicKey;
  scopeOraclePriceId: BigNumber;
  scopeOracleMaxAge: BigNumber;
  pendingFarmAdmin: PublicKey;
  strategyId: PublicKey;
  padding: BigNumber[];
};

export const farmStateStruct = new BeetStruct<FarmState>(
  [
    ['buffer', blob(8)],
    ['farmAdmin', publicKey],
    ['globalConfig', publicKey],
    ['token', tokenInfoStruct],
    ['rewardInfos', uniformFixedSizeArray(rewardInfoStruct, 10)],
    ['numRewardTokens', u64],
    ['numUsers', u64],
    ['totalStakedAmount', u64],
    ['farmVault', publicKey],
    ['farmVaultsAuthority', publicKey],
    ['farmVaultsAuthorityBump', u64],
    ['delegateAuthority', publicKey],
    ['timeUnit', u8],
    ['padding0', uniformFixedSizeArray(u8, 7)],
    ['withdrawAuthority', publicKey],
    ['depositWarmupPeriod', u32],
    ['withdrawalCooldownPeriod', u32],
    ['totalActiveStakeScaled', u128],
    ['totalPendingStakeScaled', u128],
    ['totalPendingAmount', u64],
    ['slashedAmountCurrent', u64],
    ['slashedAmountCumulative', u64],
    ['slashedAmountSpillAddress', publicKey],
    ['lockingMode', u64],
    ['lockingStartTimestamp', u64],
    ['lockingDuration', u64],
    ['lockingEarlyWithdrawalPenaltyBps', u64],
    ['depositCapAmount', u64],
    ['scopePrices', publicKey],
    ['scopeOraclePriceId', u64],
    ['scopeOracleMaxAge', u64],
    ['pendingFarmAdmin', publicKey],
    ['strategyId', publicKey],
    ['padding', uniformFixedSizeArray(u64, 86)],
  ],
  (args) => args as FarmState
);
