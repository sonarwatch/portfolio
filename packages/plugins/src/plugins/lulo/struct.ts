import {
  BeetStruct,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

export type UserAccount = {
  buffer: Buffer;
  bump: number;
  padding: number[];
  owner: PublicKey;
  mfi_account: PublicKey;
  solend_obligation: PublicKey;
  regularAllocations: BigNumber[];
  protectedAllocations: BigNumber[];
  referrer: PublicKey;
  reserved1: BigNumber[];
  lastWithdrawingId: number;
  activeWithdraws: number[];
  padding2: number[];
};

export const userAccountStruct = new BeetStruct<UserAccount>(
  [
    ['buffer', blob(8)],
    ['bump', u8],
    ['padding', uniformFixedSizeArray(u8, 7)],
    ['owner', publicKey],
    ['mfi_account', publicKey],
    ['solend_obligation', publicKey],
    ['regularAllocations', uniformFixedSizeArray(u64, 5)],
    ['protectedAllocations', uniformFixedSizeArray(u64, 5)],
    ['referrer', publicKey],
    ['reserved1', uniformFixedSizeArray(u64, 3)],
    ['lastWithdrawingId', u16],
    ['activeWithdraws', uniformFixedSizeArray(u16, 11)],
    ['padding2', uniformFixedSizeArray(u64, 8)],
  ],
  (args) => args as UserAccount
);

export type ProtocolConfig = {
  protocolId: number[];
  weight: number;
  padding: number[];
  balanceNative: BigNumber;
  refreshLastTs: BigNumber;
  accruedAmount: BigNumber;
  hashOperations: number[];
  hashRefresh: number[];
  reserved: Buffer;
};

export const protocolConfigStruct = new BeetStruct<ProtocolConfig>(
  [
    ['protocolId', uniformFixedSizeArray(u8, 8)],
    ['weight', u32],
    ['padding', uniformFixedSizeArray(u8, 4)],
    ['balanceNative', u64],
    ['refreshLastTs', u64],
    ['accruedAmount', i64],
    ['hashOperations', uniformFixedSizeArray(u8, 16)],
    ['hashRefresh', uniformFixedSizeArray(u8, 16)],
    ['reserved', blob(32)],
  ],
  (args) => args as ProtocolConfig
);

export type Allocation = {
  mint: PublicKey;
  decimals: number;
  padding: number[];
  regularAmount: BigNumber;
  protectedAmount: BigNumber;
  depositLimit: BigNumber;
  reserved1: BigNumber;
  oracle: PublicKey;
  oraclePrice: BigNumber;
  oracleLastUpdated: BigNumber;
  padding1: number[];
  totalLiquidity: BigNumber;
  accumulatedProtocolFees: BigNumber;
  pendingWithdrawals: BigNumber;
  accumulatedReferralFees: BigNumber;
  unclaimedReferralFees: BigNumber;
  totalReferredAmount: BigNumber;
  totalReferralSupply: BigNumber;
  protocols: ProtocolConfig[];
  reserved: BigNumber[];
};

export const allocationStruct = new BeetStruct<Allocation>(
  [
    ['mint', publicKey],
    ['decimals', u8],
    ['padding', uniformFixedSizeArray(u8, 7)],
    ['regularAmount', u64],
    ['protectedAmount', u64],
    ['depositLimit', u64],
    ['reserved1', u64],
    ['oracle', publicKey],
    ['oraclePrice', u64],
    ['oracleLastUpdated', u64],
    ['padding1', uniformFixedSizeArray(u8, 8)],
    ['totalLiquidity', u64],
    ['accumulatedProtocolFees', u64],
    ['pendingWithdrawals', u64],
    ['accumulatedReferralFees', u64],
    ['unclaimedReferralFees', u64],
    ['totalReferredAmount', u64],
    ['totalReferralSupply', u64],
    ['protocols', uniformFixedSizeArray(protocolConfigStruct, 8)],
    ['reserved', uniformFixedSizeArray(u64, 8)],
  ],
  (args) => args as Allocation
);

export type Pool = {
  buffer: Buffer;
  bump: number[];
  poolId: number;
  decimals: number;
  protectedBump: number[];
  regularBump: number[];
  securityFlag: number;
  padding: number[];
  protocolFeeBps: number;
  referralFeeBps: number;
  protectedInterestShareBps: number;
  coverageFloatBps: number;
  protectedMaxExposure: number;
  regularMaxExposure: number;
  oracleStaleMaxSeconds: BigNumber;
  refreshStaleMaxSeconds: BigNumber;
  withdrawCooldownSeconds: BigNumber;
  protectedTotalSupply: BigNumber;
  regularTotalSupply: BigNumber;
  lastUpdated: BigNumber;
  allocations: Allocation[];
  admin: PublicKey;
  automation: PublicKey;
  reserved: BigNumber[];
};

export const poolStruct = new BeetStruct<Pool>(
  [
    ['buffer', blob(8)],
    ['bump', uniformFixedSizeArray(u8, 1)],
    ['poolId', u8],
    ['decimals', u8],
    ['protectedBump', uniformFixedSizeArray(u8, 1)],
    ['regularBump', uniformFixedSizeArray(u8, 1)],
    ['securityFlag', u8],
    ['padding', uniformFixedSizeArray(u8, 2)],
    ['protocolFeeBps', u16],
    ['referralFeeBps', u16],
    ['protectedInterestShareBps', u16],
    ['coverageFloatBps', u16],
    ['protectedMaxExposure', u32],
    ['regularMaxExposure', u32],
    ['oracleStaleMaxSeconds', u64],
    ['refreshStaleMaxSeconds', u64],
    ['withdrawCooldownSeconds', u64],
    ['protectedTotalSupply', u64],
    ['regularTotalSupply', u64],
    ['lastUpdated', u64],
    ['allocations', uniformFixedSizeArray(allocationStruct, 5)],
    ['admin', publicKey],
    ['automation', publicKey],
    ['reserved', uniformFixedSizeArray(u64, 24)],
  ],
  (args) => args as Pool
);

export type PendingWithdrawal = {
  buffer: Buffer;
  allocationIndex: number;
  withdrawalId: number;
  padding: number[];
  owner: PublicKey;
  createdTimestamp: BigNumber;
  cooldownSeconds: BigNumber;
  nativeAmount: BigNumber;
};

export const pendingWithdrawalStruct = new BeetStruct<PendingWithdrawal>(
  [
    ['buffer', blob(8)],
    ['allocationIndex', u8],
    ['withdrawalId', u16],
    ['padding', uniformFixedSizeArray(u8, 5)],
    ['owner', publicKey],
    ['createdTimestamp', u64],
    ['cooldownSeconds', u64],
    ['nativeAmount', u64],
  ],
  (args) => args as PendingWithdrawal
);
