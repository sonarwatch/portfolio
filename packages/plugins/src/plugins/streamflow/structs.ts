import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  FixableBeetStruct,
  bool,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, u64 } from '../../utils/solana';

export type VestingAccount = {
  magic: BigNumber;
  version: number;
  createdAt: BigNumber;
  withdrawnAmount: BigNumber;
  canceledAt: BigNumber;
  endTime: BigNumber;
  lastWithdrawnAt: BigNumber;
  sender: PublicKey;
  senderToken: PublicKey;
  recipient: PublicKey;
  recipientToken: PublicKey;
  mint: PublicKey;
  escrowToken: PublicKey;
  streamflowTreasury: PublicKey;
  streamflowTreasuryToken: PublicKey;
  streamflowFeeTotal: BigNumber;
  streamflowFeeWithdrawn: BigNumber;
  streamflowFeePercent: number;
  partner: PublicKey;
  partnerToken: PublicKey;
  partnerFeeTotal: BigNumber;
  partnerFeeWithdrawn: BigNumber;
  partnerFeePercent: number;
  startTime: BigNumber;
  netAmountDeposited: BigNumber;
  period: BigNumber;
  amountPerPeriod: BigNumber;
  cliff: BigNumber;
  cliffAmount: BigNumber;
  cancelableBySender: boolean;
  cancelableByRecipient: boolean;
  automaticWithdrawal: boolean;
  transferableBySender: boolean;
  transferableByRecipient: boolean;
  canTopup: boolean;
  streamName: Buffer;
  padding: Buffer;
};

export const vestingAccountStruct = new FixableBeetStruct<VestingAccount>(
  [
    ['magic', u64],
    ['version', u8],
    ['createdAt', u64],
    ['withdrawnAmount', u64],
    ['canceledAt', u64],
    ['endTime', u64],
    ['lastWithdrawnAt', u64],
    ['sender', publicKey],
    ['senderToken', publicKey],
    ['recipient', publicKey],
    ['recipientToken', publicKey],
    ['mint', publicKey],
    ['escrowToken', publicKey],
    ['streamflowTreasury', publicKey],
    ['streamflowTreasuryToken', publicKey],
    ['streamflowFeeTotal', u64],
    ['streamflowFeeWithdrawn', u64],
    ['streamflowFeePercent', u32],
    ['partner', publicKey],
    ['partnerToken', publicKey],
    ['partnerFeeTotal', u64],
    ['partnerFeeWithdrawn', u64],
    ['partnerFeePercent', u32],
    ['startTime', u64],
    ['netAmountDeposited', u64],
    ['period', u64],
    ['amountPerPeriod', u64],
    ['cliff', u64],
    ['cliffAmount', u64],
    ['cancelableBySender', bool],
    ['cancelableByRecipient', bool],
    ['automaticWithdrawal', bool],
    ['transferableBySender', bool],
    ['transferableByRecipient', bool],
    ['canTopup', u8],
    ['streamName', blob(64)],
    ['padding', blob(505)],
  ],
  (args) => args as VestingAccount
);

// Enum for OracleType
export enum OracleType {
  None = 0,
  Test = 1,
  Pyth = 2,
  Switchboard = 3,
}

// Type and Struct for Contract
export type Contract = {
  accountDiscriminator: number[];
  bump: number;
  sender: PublicKey;
  senderTokens: PublicKey;
  stream: PublicKey;
  priceOracleType: OracleType;
  priceOracle: PublicKey;
  minPrice: BigNumber;
  maxPrice: BigNumber;
  minPercentage: BigNumber;
  maxPercentage: BigNumber;
  tickSize: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
  period: BigNumber;
  lastAmountUpdateTime: BigNumber;
  lastPrice: BigNumber;
  streamCanceledTime: BigNumber;
  initialAmountPerPeriod: BigNumber;
  initialPrice: BigNumber;
  initialNetAmount: BigNumber;
  mint: PublicKey;
  buffer: number[];
};

export const contractStruct = new FixableBeetStruct<Contract>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['sender', publicKey],
    ['senderTokens', publicKey],
    ['stream', publicKey],
    ['priceOracleType', u8], // Enum is represented as a u8
    ['priceOracle', publicKey],
    ['minPrice', u64],
    ['maxPrice', u64],
    ['minPercentage', u64],
    ['maxPercentage', u64],
    ['tickSize', u64],
    ['startTime', u64],
    ['endTime', u64],
    ['period', u64],
    ['lastAmountUpdateTime', u64],
    ['lastPrice', u64],
    ['streamCanceledTime', u64],
    ['initialAmountPerPeriod', u64],
    ['initialPrice', u64],
    ['initialNetAmount', u64],
    ['mint', publicKey],
    ['buffer', uniformFixedSizeArray(u8, 32)], // Fixed-size array of 32 bytes
  ],
  (args) => args as Contract
);

export type MerkleDistributor = {
  accountDiscriminator: number[];
  bump: number;
  version: BigNumber;
  root: number[];
  mint: PublicKey;
  tokenVault: PublicKey;
  maxTotalClaim: BigNumber;
  maxNumNodes: BigNumber;
  unlockPeriod: BigNumber;
  totalAmountClaimed: BigNumber;
  numNodesClaimed: BigNumber;
  startTs: BigNumber;
  endTs: BigNumber;
  clawbackStartTs: BigNumber;
  clawbackReceiver: PublicKey;
  admin: PublicKey;
  clawedBack: boolean;
  claimsClosableByAdmin: boolean;
  canUpdateDuration: boolean;
  totalAmountUnlocked: BigNumber;
  totalAmountLocked: BigNumber;
  lastDurationUpdateTs: BigNumber;
  totalClaimablePreUpdate: BigNumber;
  clawedBackTs: BigNumber;
  claimsClosableByClaimant: boolean;
  claimsLimit: number;
  buffer2: number[];
  buffer3: number[];
};

export const merkleDistributorStruct = new FixableBeetStruct<MerkleDistributor>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['bump', u8],
    ['version', u64],
    ['root', uniformFixedSizeArray(u8, 32)], // Fixed-size array of 32 bytes
    ['mint', publicKey],
    ['tokenVault', publicKey],
    ['maxTotalClaim', u64],
    ['maxNumNodes', u64],
    ['unlockPeriod', u64],
    ['totalAmountClaimed', u64],
    ['numNodesClaimed', u64],
    ['startTs', u64],
    ['endTs', u64],
    ['clawbackStartTs', u64],
    ['clawbackReceiver', publicKey],
    ['admin', publicKey],
    ['clawedBack', bool],
    ['claimsClosableByAdmin', bool],
    ['canUpdateDuration', bool],
    ['totalAmountUnlocked', u64],
    ['totalAmountLocked', u64],
    ['lastDurationUpdateTs', u64],
    ['totalClaimablePreUpdate', u64],
    ['clawedBackTs', u64],
    ['claimsClosableByClaimant', bool],
    ['claimsLimit', u16],
    ['buffer2', uniformFixedSizeArray(u8, 20)], // Fixed-size array of 20 bytes
    ['buffer3', uniformFixedSizeArray(u8, 32)], // Fixed-size array of 32 bytes
  ],
  (args) => args as MerkleDistributor
);

// Type for ClaimStatus
export type ClaimStatus = {
  accountDiscriminator: number[];
  claimant: PublicKey;
  lockedAmount: BigNumber;
  lockedAmountWithdrawn: BigNumber;
  unlockedAmount: BigNumber;
  lastClaimTs: BigNumber;
  lastAmountPerUnlock: BigNumber;
  closed: boolean;
  distributor: PublicKey;
  claimsCount: number;
  closedTs: BigNumber;
  buffer2: number[];
};

// Struct for ClaimStatus
export const claimStatusStruct = new FixableBeetStruct<ClaimStatus>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['claimant', publicKey],
    ['lockedAmount', u64],
    ['lockedAmountWithdrawn', u64],
    ['unlockedAmount', u64],
    ['lastClaimTs', u64],
    ['lastAmountPerUnlock', u64],
    ['closed', bool],
    ['distributor', publicKey],
    ['claimsCount', u16],
    ['closedTs', u64],
    ['buffer2', uniformFixedSizeArray(u8, 22)], // Fixed-size array of 22 bytes
  ],
  (args) => args as ClaimStatus
);
