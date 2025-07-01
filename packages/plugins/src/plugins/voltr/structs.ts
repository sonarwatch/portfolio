import {
  BeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { u128, u64 } from '../../utils/solana';

// Underlying VaultAsset struct
export type VaultAsset = {
  mint: PublicKey;
  idleAta: PublicKey;
  totalValue: BigNumber;
  idleAtaAuthBump: number;
  reserved: number[];
};

export const vaultAssetStruct = new BeetStruct<VaultAsset>(
  [
    ['mint', publicKey],
    ['idleAta', publicKey],
    ['totalValue', u64],
    ['idleAtaAuthBump', u8],
    ['reserved', uniformFixedSizeArray(u8, 95)],
  ],
  (args) => args as VaultAsset
);

// Underlying VaultLp struct
export type VaultLp = {
  mint: PublicKey;
  mintBump: number;
  mintAuthBump: number;
  reserved: number[];
};

export const vaultLpStruct = new BeetStruct<VaultLp>(
  [
    ['mint', publicKey],
    ['mintBump', u8],
    ['mintAuthBump', u8],
    ['reserved', uniformFixedSizeArray(u8, 62)],
  ],
  (args) => args as VaultLp
);

// Underlying VaultConfiguration struct
export type VaultConfiguration = {
  maxCap: BigNumber;
  startAtTs: BigNumber;
  lockedProfitDegradationDuration: BigNumber;
  withdrawalWaitingPeriod: BigNumber;
  reserved: number[];
};

export const vaultConfigurationStruct = new BeetStruct<VaultConfiguration>(
  [
    ['maxCap', u64],
    ['startAtTs', u64],
    ['lockedProfitDegradationDuration', u64],
    ['withdrawalWaitingPeriod', u64],
    ['reserved', uniformFixedSizeArray(u8, 48)],
  ],
  (args) => args as VaultConfiguration
);

// Underlying FeeConfiguration struct
export type FeeConfiguration = {
  managerPerformanceFee: number;
  adminPerformanceFee: number;
  managerManagementFee: number;
  adminManagementFee: number;
  redemptionFee: number;
  issuanceFee: number;
  reserved: number[];
};

export const feeConfigurationStruct = new BeetStruct<FeeConfiguration>(
  [
    ['managerPerformanceFee', u16],
    ['adminPerformanceFee', u16],
    ['managerManagementFee', u16],
    ['adminManagementFee', u16],
    ['redemptionFee', u16],
    ['issuanceFee', u16],
    ['reserved', uniformFixedSizeArray(u8, 36)],
  ],
  (args) => args as FeeConfiguration
);

// Underlying FeeUpdate struct
export type FeeUpdate = {
  lastPerformanceFeeUpdateTs: BigNumber;
  lastManagementFeeUpdateTs: BigNumber;
};

export const feeUpdateStruct = new BeetStruct<FeeUpdate>(
  [
    ['lastPerformanceFeeUpdateTs', u64],
    ['lastManagementFeeUpdateTs', u64],
  ],
  (args) => args as FeeUpdate
);

// Underlying FeeState struct
export type FeeState = {
  accumulatedLpManagerFees: BigNumber;
  accumulatedLpAdminFees: BigNumber;
  accumulatedLpProtocolFees: BigNumber;
  reserved: number[];
};

export const feeStateStruct = new BeetStruct<FeeState>(
  [
    ['accumulatedLpManagerFees', u64],
    ['accumulatedLpAdminFees', u64],
    ['accumulatedLpProtocolFees', u64],
    ['reserved', uniformFixedSizeArray(u8, 24)],
  ],
  (args) => args as FeeState
);

// Underlying HighWaterMark struct
export type HighWaterMark = {
  highestAssetPerLpDecimalBits: BigNumber;
  lastUpdatedTs: BigNumber;
  reserved: number[];
};

export const highWaterMarkStruct = new BeetStruct<HighWaterMark>(
  [
    ['highestAssetPerLpDecimalBits', u128],
    ['lastUpdatedTs', u64],
    ['reserved', uniformFixedSizeArray(u8, 8)],
  ],
  (args) => args as HighWaterMark
);

// Underlying LockedProfitState struct
export type LockedProfitState = {
  lastUpdatedLockedProfit: BigNumber;
  lastReport: BigNumber;
};

export const lockedProfitStateStruct = new BeetStruct<LockedProfitState>(
  [
    ['lastUpdatedLockedProfit', u64],
    ['lastReport', u64],
  ],
  (args) => args as LockedProfitState
);

// Main Vault struct
export type Vault = {
  discriminator: number[];
  name: number[];
  description: number[];
  asset: VaultAsset;
  lp: VaultLp;
  manager: PublicKey;
  admin: PublicKey;
  vaultConfiguration: VaultConfiguration;
  feeConfiguration: FeeConfiguration;
  feeUpdate: FeeUpdate;
  feeState: FeeState;
  highWaterMark: HighWaterMark;
  lastUpdatedTs: BigNumber;
  version: number;
  padding0: number[];
  lockedProfitState: LockedProfitState;
  reserved: number[];
};

export const vaultStruct = new BeetStruct<Vault>(
  [
    ['discriminator', uniformFixedSizeArray(u8, 8)],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['description', uniformFixedSizeArray(u8, 64)],
    ['asset', vaultAssetStruct],
    ['lp', vaultLpStruct],
    ['manager', publicKey],
    ['admin', publicKey],
    ['vaultConfiguration', vaultConfigurationStruct],
    ['feeConfiguration', feeConfigurationStruct],
    ['feeUpdate', feeUpdateStruct],
    ['feeState', feeStateStruct],
    ['highWaterMark', highWaterMarkStruct],
    ['lastUpdatedTs', u64],
    ['version', u8],
    ['padding0', uniformFixedSizeArray(u8, 7)],
    ['lockedProfitState', lockedProfitStateStruct],
    ['reserved', uniformFixedSizeArray(u8, 240)],
  ],
  (args) => args as Vault
);
