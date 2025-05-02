import {
  BeetStruct,
  FixableBeetStruct,
  bool,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import { blob, u128, u64 } from '../../utils/solana';

export type VaultBumps = {
  vaultBump: number;
  tokenVaultBump: number;
};
export const vaultBumpsStruct = new BeetStruct<VaultBumps>(
  [
    ['vaultBump', u8],
    ['tokenVaultBump', u8],
  ],
  (args) => args as VaultBumps
);

export type LockedProfitTracker = {
  lastUpdatedLockedProfit: BigNumber;
  lastReport: BigNumber;
  lockedProfitDegradation: BigNumber;
};
export const lockedProfitTrackerStruct = new BeetStruct<LockedProfitTracker>(
  [
    ['lastUpdatedLockedProfit', u64],
    ['lastReport', u64],
    ['lockedProfitDegradation', u64],
  ],
  (args) => args as LockedProfitTracker
);

export type Vault = {
  buffer: Buffer;
  /// The flag, if admin set enable = false, then the user can only withdraw and cannot deposit in the vault.
  enabled: number;
  /// Vault nonce, to create vault seeds
  bumps: VaultBumps;
  /// The total liquidity of the vault, including remaining tokens in token_vault and the liquidity in all strategies.
  total_amount: BigNumber;
  /// Token account, hold liquidity in vault reserve
  token_vault: PublicKey;
  /// Hold lp token of vault, each time rebalance crank is called, vault calculate performance fee and mint corresponding lp token amount to fee_vault. fee_vault is owned by treasury address
  fee_vault: PublicKey;
  /// Token mint that vault supports
  token_mint: PublicKey;
  /// Lp mint of vault
  lp_mint: PublicKey;
  /// The list of strategy addresses that vault supports, vault can support up to MAX_STRATEGY strategies at the same time.
  strategies: PublicKey[];
  /// The base address to create vault seeds
  base: PublicKey;
  /// Admin of vault
  admin: PublicKey;
  /// Person who can send the crank. Operator can only send liquidity to strategies that admin defined, and claim reward to account of treasury address
  operator: PublicKey;
  /// Stores information for locked profit.
  locked_profit_tracker: LockedProfitTracker;
};

export const vaultStruct = new BeetStruct<Vault>(
  [
    ['buffer', blob(8)],
    ['enabled', u8],
    ['bumps', vaultBumpsStruct],
    ['total_amount', u64],
    ['token_vault', publicKey],
    ['fee_vault', publicKey],
    ['token_mint', publicKey],
    ['lp_mint', publicKey],
    ['strategies', uniformFixedSizeArray(publicKey, 30)],
    ['base', publicKey],
    ['admin', publicKey],
    ['operator', publicKey],
    ['locked_profit_tracker', lockedProfitTrackerStruct],
  ],
  (args) => args as Vault
);

export type Padding = {
  padding0: number[];
  padding: BigNumber[];
};

export const paddingStruct = new FixableBeetStruct<Padding>(
  [
    ['padding0', uniformFixedSizeArray(u8, 15)],
    ['padding', uniformFixedSizeArray(u128, 29)],
  ],
  (args) => args as Padding
);

export type Padding2 = {
  padding0: number[];
  padding1: BigNumber[];
  padding2: BigNumber[];
};

export const padding2Struct = new FixableBeetStruct<Padding2>(
  [
    ['padding0', uniformFixedSizeArray(u8, 6)],
    ['padding1', uniformFixedSizeArray(u64, 21)],
    ['padding2', uniformFixedSizeArray(u64, 21)],
  ],
  (args) => args as Padding2
);

export enum DepegType {
  None,
  Marinade,
  Lido,
  SplStake,
}

export type Depeg = {
  baseVirtualPrice: BigNumber;
  baseCacheUpdated: BigNumber;
  depegType: DepegType;
};

export const depegStruct = new BeetStruct<Depeg>(
  [
    ['baseVirtualPrice', u64],
    ['baseCacheUpdated', u64],
    ['depegType', u8],
  ],
  (args) => args as Depeg
);

export type TokenMultiplier = {
  tokenAMultiplier: BigNumber;
  tokenBMultiplier: BigNumber;
  precisionFactor: number;
};

export const TokenMultiplierStruct = new BeetStruct<TokenMultiplier>(
  [
    ['tokenAMultiplier', u64],
    ['tokenBMultiplier', u64],
    ['precisionFactor', u8],
  ],
  (args) => args as TokenMultiplier
);

export type StableParams = {
  amp: BigNumber;
  token_multiplier: TokenMultiplier;
  depeg: Depeg;
  last_amp_updated_timestamp: BigNumber;
};

export const stableParamsStruct = new BeetStruct<StableParams>(
  [
    ['amp', u64],
    ['token_multiplier', TokenMultiplierStruct],
    ['depeg', depegStruct],
    ['last_amp_updated_timestamp', u64],
  ],
  (args) => args as StableParams
);

export enum CurveType {
  ConstantProduct,
  Stable,
}

export enum PoolType {
  Permissioned,
  Permissionless,
}

export type PoolFees = {
  tradeFeeNumerator: BigNumber;
  tradeFeeDenominator: BigNumber;
  ownerTradeFeeNumerator: BigNumber;
  ownerTradeFeeDenominator: BigNumber;
};

export const poolFeesStruct = new BeetStruct<PoolFees>(
  [
    ['tradeFeeNumerator', u64],
    ['tradeFeeDenominator', u64],
    ['ownerTradeFeeNumerator', u64],
    ['ownerTradeFeeDenominator', u64],
  ],
  (args) => args as PoolFees
);

export type Boostrapping = {
  activationPoint: BigNumber;
  whitelistedVault: PublicKey;
  poolCreator: PublicKey;
  activationType: number;
};

export const boostrappingStruct = new BeetStruct<Boostrapping>(
  [
    ['activationPoint', u64],
    ['whitelistedVault', publicKey],
    ['poolCreator', publicKey],
    ['activationType', u8],
  ],
  (args) => args as Boostrapping
);

export type PartnerInfo = {
  feeNumerator: BigNumber;
  partnerAuthority: PublicKey;
  pendingFeeA: BigNumber;
  pendingFeeB: BigNumber;
};

export const partnerInfoStruct = new BeetStruct<PartnerInfo>(
  [
    ['feeNumerator', u64],
    ['partnerAuthority', publicKey],
    ['pendingFeeA', u64],
    ['pendingFeeB', u64],
  ],
  (args) => args as PartnerInfo
);

export type PoolState = {
  buffer: Buffer;
  lpMint: PublicKey;
  tokenAMint: PublicKey;
  tokenBMint: PublicKey;
  aVault: PublicKey;
  bVault: PublicKey;
  aVaultLp: PublicKey;
  bVaultLp: PublicKey;
  aVaultLpBump: number;
  enabled: boolean;
  adminTokenAFee: PublicKey;
  adminTokenBFee: PublicKey;
  admin: PublicKey;
  feeLastUpdatedAt?: BigNumber;
  padding0?: number[];
  fees: PoolFees;
  poolType: PoolType;
  stake: PublicKey;
  totalLockedLp?: BigNumber;
  bootstrapping?: Boostrapping;
  partnerInfo?: PartnerInfo;
  padding2?: Padding2;
  padding: Padding;
  curveType: CurveType;
};

export const poolStateStruct = new FixableBeetStruct<PoolState>(
  [
    ['buffer', blob(8)],
    ['lpMint', publicKey],
    ['tokenAMint', publicKey],
    ['tokenBMint', publicKey],
    ['aVault', publicKey],
    ['bVault', publicKey],
    ['aVaultLp', publicKey],
    ['bVaultLp', publicKey],
    ['aVaultLpBump', u8],
    ['enabled', bool],
    ['adminTokenAFee', publicKey],
    ['adminTokenBFee', publicKey],
    ['admin', publicKey],
    ['fees', poolFeesStruct],
    ['poolType', u8],
    ['stake', publicKey],
    ['padding', paddingStruct],
    ['curveType', u8],
  ],
  (args) => args as PoolState
);

export const poolStateV2Struct = new FixableBeetStruct<PoolState>(
  [
    ['buffer', blob(8)],
    ['lpMint', publicKey],
    ['tokenAMint', publicKey],
    ['tokenBMint', publicKey],
    ['aVault', publicKey],
    ['bVault', publicKey],
    ['aVaultLp', publicKey],
    ['bVaultLp', publicKey],
    ['aVaultLpBump', u8],
    ['enabled', bool],
    ['adminTokenAFee', publicKey],
    ['adminTokenBFee', publicKey],
    ['feeLastUpdatedAt', u64],
    ['padding0', uniformFixedSizeArray(u8, 24)],
    ['fees', poolFeesStruct],
    ['poolType', u8],
    ['stake', publicKey],
    ['totalLockedLp', u64],
    ['bootstrapping', boostrappingStruct],
    ['partnerInfo', partnerInfoStruct],
    ['padding2', padding2Struct],
    ['curveType', u8],
  ],
  (args) => args as PoolState
);

export type Farm = {
  buffer: Buffer;
  authority: PublicKey;
  paused: boolean;
  stakingMint: PublicKey;
  stakingVault: PublicKey;
  rewardAMint: PublicKey;
  rewardAVault: PublicKey;
  rewardBMint: PublicKey;
  rewardBVault: PublicKey;
  rewardDuration: BigNumber;
  rewardDurationEnd: BigNumber;
  lastUpdateTime: BigNumber;
  rewardARate: BigNumber;
  rewardBRate: BigNumber;
  rewardAPerTokenStored: BigNumber;
  rewardBPerTokenStored: BigNumber;
  userStakeCount: number;
  funders: PublicKey[];
  rewardARateU128: BigNumber;
  rewardBRateU128: BigNumber;
  poolBump: number;
  totalStaked: BigNumber;
};

export const farmStruct = new BeetStruct<Farm>(
  [
    ['buffer', blob(8)],
    ['authority', publicKey],
    ['paused', bool],
    ['stakingMint', publicKey],
    ['stakingVault', publicKey],
    ['rewardAMint', publicKey],
    ['rewardAVault', publicKey],
    ['rewardBMint', publicKey],
    ['rewardBVault', publicKey],
    ['rewardDuration', u64],
    ['rewardDurationEnd', u64],
    ['lastUpdateTime', u64],
    ['rewardARate', u64],
    ['rewardBRate', u64],
    ['rewardAPerTokenStored', u128],
    ['rewardBPerTokenStored', u128],
    ['userStakeCount', u32],
    ['funders', uniformFixedSizeArray(publicKey, 3)],
    ['rewardARateU128', u128],
    ['rewardBRateU128', u128],
    ['poolBump', u8],
    ['totalStaked', u64],
  ],
  (args) => args as Farm
);

export type FarmAccount = {
  buffer: Buffer;
  pool: PublicKey;
  owner: PublicKey;
  rewardAPerTokenComplete: BigNumber;
  rewardBPerTokenComplete: BigNumber;
  rewardAPerTokenPending: BigNumber;
  rewardBPerTokenPending: BigNumber;
  balanceStaked: BigNumber;
  nonce: number;
};

export const farmAccountStruct = new BeetStruct<FarmAccount>(
  [
    ['buffer', blob(8)],
    ['pool', publicKey],
    ['owner', publicKey],
    ['rewardAPerTokenComplete', u128],
    ['rewardBPerTokenComplete', u128],
    ['rewardAPerTokenPending', u64],
    ['rewardBPerTokenPending', u64],
    ['balanceStaked', u64],
    ['nonce', u8],
  ],
  (args) => args as FarmAccount
);

export type Escrow = {
  buffer: Buffer;
  dlmmVault: PublicKey;
  owner: PublicKey;
  totalDeposit: BigNumber;
  claimedToken: BigNumber;
  lastClaimedTs: BigNumber;
  refunded: number;
  padding1: number[];
  padding: BigNumber[];
};

export const escrowStruct = new BeetStruct<Escrow>(
  [
    ['buffer', blob(8)],
    ['dlmmVault', publicKey],
    ['owner', publicKey],
    ['totalDeposit', u64],
    ['claimedToken', u64],
    ['lastClaimedTs', u64],
    ['refunded', u8],
    ['padding1', uniformFixedSizeArray(u8, 7)],
    ['padding', uniformFixedSizeArray(u128, 2)],
  ],
  (args) => args as Escrow
);
