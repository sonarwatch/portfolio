import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, i64, u128, u64 } from '../../utils/solana';

type RealizedYield = {
  gainPerSecond: BigNumber;
  apr: BigNumber;
  buffer: Buffer[];
};

export const realizedYieldStruct = new BeetStruct<RealizedYield>(
  [
    ['gainPerSecond', u128],
    ['apr', u128],
    ['buffer', uniformFixedSizeArray(blob(8), 4)],
  ],
  (args) => args as RealizedYield
);

type FeesV1 = {
  feeMultiplier: BigNumber;
  controllerFee: BigNumber;
  platformFee: BigNumber;
  withdrawFee: BigNumber;
  depositFee: BigNumber;
  feeWallet: PublicKey;
  totalCollectedA: BigNumber;
  totalCollectedB: BigNumber;
  buffer: BigNumber[];
};

export const feesV1Struct = new BeetStruct<FeesV1>(
  [
    ['feeMultiplier', u64],
    ['controllerFee', u64],
    ['platformFee', u64],
    ['withdrawFee', u64],
    ['depositFee', u64],
    ['feeWallet', publicKey],
    ['totalCollectedA', u64],
    ['totalCollectedB', u64],
    ['buffer', uniformFixedSizeArray(u64, 6)],
  ],
  (args) => args as FeesV1
);

type VaultBaseV1 = {
  nonce: number;
  tag: number[];
  pda: PublicKey;
  pdaNonce: number;
  pdaAlignment: number[];
  totalDepositedBalance: BigNumber;
  totalShares: BigNumber;
  underlyingMint: PublicKey;
  underlyingWithdrawQueue: PublicKey;
  underlyingDepositQueue: PublicKey;
  underlyingCompoundQueue: PublicKey;
  sharesMint: PublicKey;
  withdrawsPaused: number;
  depositsPaused: number;
  compoundPaused: number;
  supportsCompound: number;
  rebasePaused: number;
  rebalancePaused: number;
  stateAlignment: number[];
  precisionFactor: BigNumber;
  lastCompoundTime: BigNumber;
  compoundInterval: BigNumber;
  slippageTolerance: number;
  slipAlignment: number[];
  fees: FeesV1;
  farm: BigNumber[];
  configured: number;
  configuredAlignment: number[];
  pendingFees: BigNumber;
  totalDepositedBalanceCap: BigNumber;
  realizedYield: RealizedYield;
  buffer: BigNumber[];
};

export const vaultBaseV1Struct = new BeetStruct<VaultBaseV1>(
  [
    ['nonce', u8],
    ['tag', uniformFixedSizeArray(u8, 32)],
    ['pda', publicKey],
    ['pdaNonce', u8],
    ['pdaAlignment', uniformFixedSizeArray(u8, 6)],
    ['totalDepositedBalance', u64],
    ['totalShares', u64],
    ['underlyingMint', publicKey],
    ['underlyingWithdrawQueue', publicKey],
    ['underlyingDepositQueue', publicKey],
    ['underlyingCompoundQueue', publicKey],
    ['sharesMint', publicKey],
    ['withdrawsPaused', u8],
    ['depositsPaused', u8],
    ['compoundPaused', u8],
    ['supportsCompound', u8],
    ['rebasePaused', u8],
    ['rebalancePaused', u8],
    ['stateAlignment', uniformFixedSizeArray(u8, 2)],
    ['precisionFactor', u64],
    ['lastCompoundTime', i64],
    ['compoundInterval', i64],
    ['slippageTolerance', u8],
    ['slipAlignment', uniformFixedSizeArray(u8, 7)],
    ['fees', feesV1Struct],
    ['farm', uniformFixedSizeArray(u64, 2)],
    ['configured', u8],
    ['configuredAlignment', uniformFixedSizeArray(u8, 7)],
    ['pendingFees', u64],
    ['totalDepositedBalanceCap', u64],
    ['realizedYield', realizedYieldStruct],
    ['buffer', uniformFixedSizeArray(u64, 4)],
  ],
  (args) => args as VaultBaseV1
);

export enum ProgramType {
  SplUnmodified = 0,
  SplModifiedSolend = 1,
  MangoV3 = 2,
  Unknown = 3,
}

type StandaloneVaultCacheV1 = {
  vaultAddress: PublicKey;
  depositedBalance: BigNumber;
  programType: ProgramType;
  programAddress: PublicKey;
  sharesMint: PublicKey;
  sharesAccount: PublicKey;
  alignment: number[];
  buffer: BigNumber[];
};

export const standaloneVaultCacheV1Struct =
  new BeetStruct<StandaloneVaultCacheV1>(
    [
      ['vaultAddress', publicKey],
      ['depositedBalance', u64],
      ['programType', u8],
      ['programAddress', publicKey],
      ['sharesMint', publicKey],
      ['sharesAccount', publicKey],
      ['alignment', uniformFixedSizeArray(u8, 7)],
      ['buffer', uniformFixedSizeArray(u64, 6)],
    ],
    (args) => args as StandaloneVaultCacheV1
  );

export type MultiDepositOptimizerV1 = {
  buffer: Buffer;
  base: VaultBaseV1;
  lastRebaseSlot: BigNumber;
  standaloneVaults: StandaloneVaultCacheV1[];
  targetVault: PublicKey;
  stateTransitionAccount: PublicKey;
  minimumRebalanceAmount: BigNumber;
  pading: number[];
};

export const multiDepositOptimizerV1Struct =
  new BeetStruct<MultiDepositOptimizerV1>(
    [
      ['buffer', blob(8)],
      ['base', vaultBaseV1Struct],
      ['lastRebaseSlot', u64],
      [
        'standaloneVaults',
        uniformFixedSizeArray(standaloneVaultCacheV1Struct, 6),
      ],
      ['targetVault', publicKey],
      ['stateTransitionAccount', publicKey],
      ['minimumRebalanceAmount', u64],
      ['pading', uniformFixedSizeArray(u8, 272)],
    ],
    (args) => args as MultiDepositOptimizerV1
  );

type DepositTrackingV1 = {
  buffer: Buffer;
  owner: PublicKey;
  vault: PublicKey;
  pdaNonce: number;
  queueNonce: number;
  alignment: number[];
  shares: BigNumber;
  depositedBalance: BigNumber;
  lastDepositTime: BigNumber;
  pendingWithdrawAmount: BigNumber;
  totalDepositedUnderlying: BigNumber;
  totalWithdrawnUnderlying: BigNumber;
  lastPendingReward: BigNumber;
  rewardPerSharePaid: BigNumber;
  extraDataAccount: PublicKey;
  padding: number[];
};

export const depositTrackingV1Struct = new BeetStruct<DepositTrackingV1>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['vault', publicKey],
    ['pdaNonce', u8],
    ['queueNonce', u8],
    ['alignment', uniformFixedSizeArray(u8, 6)],
    ['shares', u64],
    ['depositedBalance', u64],
    ['lastDepositTime', i64],
    ['pendingWithdrawAmount', u64],
    ['totalDepositedUnderlying', u64],
    ['totalWithdrawnUnderlying', u64],
    ['lastPendingReward', u64],
    ['rewardPerSharePaid', u128],
    ['extraDataAccount', publicKey],
    ['padding', uniformFixedSizeArray(u8, 256)],
  ],
  (args) => args as DepositTrackingV1
);

export type LastUpdateSlot = {
  slot: BigNumber;
  stale: number;
};
export const lastUpdateSlotStruct = new BeetStruct<LastUpdateSlot>(
  [
    ['slot', u64],
    ['stale', u8],
  ],
  (args) => args as LastUpdateSlot
);

export type Liquidity = {
  mintPubKey: PublicKey;
  mintDecimals: number;
  supplyPubKey: PublicKey;
  feeReceiver: PublicKey;
  oraclePubKey: PublicKey;
  availableAmount: BigNumber;
  borrowedAmountWads: BigNumber;
  cumulativeBorrowRate: BigNumber;
  marketPrice: BigNumber;
  platformAmountWads: BigNumber;
  platformFees: number;
  collateralMint: PublicKey;
};
export const liquidityStruct = new BeetStruct<Liquidity>(
  [
    ['mintPubKey', publicKey],
    ['mintDecimals', u8],
    ['supplyPubKey', publicKey],
    ['feeReceiver', publicKey],
    ['oraclePubKey', publicKey],
    ['availableAmount', u64],
    ['borrowedAmountWads', u128],
    ['cumulativeBorrowRate', u128],
    ['marketPrice', u128],
    ['platformAmountWads', u128],
    ['platformFees', u8],
    ['collateralMint', publicKey],
  ],
  (args) => args as Liquidity
);

export type LendingReserve = {
  version: number;
  lastUpdateSlot: LastUpdateSlot;
  lendingMarket: PublicKey;
  borrowAuthorizer: PublicKey;
  liquidity: Liquidity;
};
export const lendingReserveStruct = new BeetStruct<LendingReserve>(
  [
    ['version', u8],
    ['lastUpdateSlot', lastUpdateSlotStruct],
    ['lendingMarket', publicKey],
    ['borrowAuthorizer', publicKey],
    ['liquidity', liquidityStruct],
  ],
  (args) => args as LendingReserve
);

export type Obligation = {
  obligationAccount: PublicKey;
  coinAmount: BigNumber;
  pcAmount: BigNumber;
  depositedLpTokens: BigNumber;
  positionState: number;
};

export const obligationStruct = new BeetStruct<Obligation>(
  [
    ['obligationAccount', publicKey],
    ['coinAmount', u64],
    ['pcAmount', u64],
    ['depositedLpTokens', u64],
    ['positionState', u8],
  ],
  (args) => args as Obligation
);

export type UserFarm = {
  buffer: Buffer;
  authority: PublicKey;
  leveragedFarm: PublicKey;
  userFarmNumber: number;
  numberOfObligations: number;
  numberOfUserFarms: number;
  nonce: number;
  obligations: Obligation[];
};

export const userFarmStruct = new BeetStruct<UserFarm>(
  [
    ['buffer', blob(8)],
    ['authority', publicKey],
    ['leveragedFarm', publicKey],
    ['userFarmNumber', u8],
    ['numberOfObligations', u8],
    ['numberOfUserFarms', u8],
    ['nonce', u8],
    ['obligations', uniformFixedSizeArray(obligationStruct, 3)],
  ],
  (args) => args as UserFarm
);

export type ObligationLiquity = {
  borrowReserve: PublicKey;
  cumulativeBorrowRateWads: BigNumber;
  borrowedAmountWads: BigNumber;
  marketValue: BigNumber;
};

export const obligationLiquityStruct = new BeetStruct<ObligationLiquity>(
  [
    ['borrowReserve', publicKey],
    ['cumulativeBorrowRateWads', u128],
    ['borrowedAmountWads', u128],
    ['marketValue', u128],
  ],
  (args) => args as ObligationLiquity
);

export type LendingObligation = {
  version: number;
  lastUpdateSlot: LastUpdateSlot;
  lendingMarket: PublicKey;
  owner: PublicKey;
  borrowedValue: BigNumber;
  vaultShares: BigNumber;
  lpTokens: BigNumber;
  coinDeposits: BigNumber;
  pcDeposits: BigNumber;
  depositsMarketValue: BigNumber;
  lpDecimals: number;
  coinDecimals: number;
  pcDecimals: number;
  depositsLen: number;
  borrowsLen: number;
  obligationLiquidities: ObligationLiquity[];
};

export const lendingObligationStruct = new BeetStruct<LendingObligation>(
  [
    ['version', u8],
    ['lastUpdateSlot', lastUpdateSlotStruct],
    ['lendingMarket', publicKey],
    ['owner', publicKey],
    ['borrowedValue', u128],
    ['vaultShares', u64],
    ['lpTokens', u64],
    ['coinDeposits', u64],
    ['pcDeposits', u64],
    ['depositsMarketValue', u128],
    ['lpDecimals', u8],
    ['coinDecimals', u8],
    ['pcDecimals', u8],
    ['depositsLen', u8],
    ['borrowsLen', u8],
    [
      'obligationLiquidities',
      uniformFixedSizeArray(obligationLiquityStruct, 2),
    ],
  ],
  (args) => args as LendingObligation
);
