import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type Liquidity = {
  buffer: Buffer;
  poolRegistry: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amountDeposited: BigNumber;
  lastObservedTap: BigNumber;
  lastClaimed: BigNumber;
  totalEarned: BigNumber;
  createdAt: BigNumber;
  space: number[];
};

export const liquidityStruct = new BeetStruct<Liquidity>(
  [
    ['buffer', blob(8)],
    ['poolRegistry', publicKey],
    ['mint', publicKey],
    ['owner', publicKey],
    ['amountDeposited', u64],
    ['lastObservedTap', u64],
    ['lastClaimed', i64],
    ['totalEarned', u64],
    ['createdAt', i64],
    ['space', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as Liquidity
);

export type UnstakingTicket = {
  totalUnstaked: BigNumber;
  createdAt: BigNumber;
};

export const unstakingTicketStruct = new BeetStruct<UnstakingTicket>(
  [
    ['totalUnstaked', u64],
    ['createdAt', i64],
  ],
  (args) => args as UnstakingTicket
);

export type UserMetadata = {
  buffer: Buffer;
  owner: PublicKey;
  accountOpenedAt: BigNumber;
  totalStaked: BigNumber;
  lastObservedTap: BigNumber;
  lastClaimed: BigNumber;
  totalEarned: BigNumber;
  unstakingTickets: UnstakingTicket[];
};

export const userMetadataStruct = new BeetStruct<UserMetadata>(
  [
    ['buffer', blob(8)],
    ['owner', publicKey],
    ['accountOpenedAt', i64],
    ['totalStaked', u64],
    ['lastObservedTap', u64],
    ['lastClaimed', i64],
    ['totalEarned', u64],
    ['unstakingTickets', uniformFixedSizeArray(unstakingTicketStruct, 64)],
  ],
  (args) => args as UserMetadata
);

export type PartnerInfo = {
  partnerId: BigNumber;
  lpTokenLinkedWithPartner: BigNumber;
  cumulativeFeeTotalTimesTvlShareToken0: BigNumber;
  cumulativeFeeTotalTimesTvlShareToken1: BigNumber;
};

export const partnerInfoStruct = new BeetStruct<PartnerInfo>(
  [
    ['partnerId', u64],
    ['lpTokenLinkedWithPartner', u64],
    ['cumulativeFeeTotalTimesTvlShareToken0', u64],
    ['cumulativeFeeTotalTimesTvlShareToken1', u64],
  ],
  (args) => args as PartnerInfo
);

export type PoolState = {
  accountDiscriminator: number[];
  ammConfig: PublicKey;
  poolCreator: PublicKey;
  token0Vault: PublicKey;
  token1Vault: PublicKey;
  token0Mint: PublicKey;
  token1Mint: PublicKey;
  padding: number[];
  token0Program: PublicKey;
  token1Program: PublicKey;
  observationKey: PublicKey;
  authBump: number;
  status: number;
  padding2: number;
  mint0Decimals: number;
  mint1Decimals: number;
  lpSupply: BigNumber;
  protocolFeesToken0: BigNumber;
  protocolFeesToken1: BigNumber;
  fundFeesToken0: BigNumber;
  fundFeesToken1: BigNumber;
  openTime: BigNumber;
  recentEpoch: BigNumber;
  cumulativeTradeFeesToken0: BigNumber;
  cumulativeTradeFeesToken1: BigNumber;
  cumulativeVolumeToken0: BigNumber;
  cumulativeVolumeToken1: BigNumber;
  latestDynamicFeeRate: BigNumber;
  maxTradeFeeRate: BigNumber;
  volatilityFactor: BigNumber;
  token0VaultAmount: BigNumber;
  token1VaultAmount: BigNumber;
  maxSharedToken0: BigNumber;
  maxSharedToken1: BigNumber;
  partners: PartnerInfo[];
  token0AmountInKamino: BigNumber;
  token1AmountInKamino: BigNumber;
  withdrawnKaminoProfitToken0: BigNumber;
  withdrawnKaminoProfitToken1: BigNumber;
};

export const poolStateStruct = new BeetStruct<PoolState>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['ammConfig', publicKey],
    ['poolCreator', publicKey],
    ['token0Vault', publicKey],
    ['token1Vault', publicKey],
    ['padding', uniformFixedSizeArray(u8, 32)],
    ['token0Mint', publicKey],
    ['token1Mint', publicKey],
    ['token0Program', publicKey],
    ['token1Program', publicKey],
    ['observationKey', publicKey],
    ['authBump', u8],
    ['status', u8],
    ['padding2', u8],
    ['mint0Decimals', u8],
    ['mint1Decimals', u8],
    ['lpSupply', u64],
    ['protocolFeesToken0', u64],
    ['protocolFeesToken1', u64],
    ['fundFeesToken0', u64],
    ['fundFeesToken1', u64],
    ['openTime', u64],
    ['recentEpoch', u64],
    ['cumulativeTradeFeesToken0', u128],
    ['cumulativeTradeFeesToken1', u128],
    ['cumulativeVolumeToken0', u128],
    ['cumulativeVolumeToken1', u128],
    ['latestDynamicFeeRate', u64],
    ['maxTradeFeeRate', u64],
    ['volatilityFactor', u64],
    ['token0VaultAmount', u64],
    ['token1VaultAmount', u64],
    ['maxSharedToken0', u64],
    ['maxSharedToken1', u64],
    ['partners', uniformFixedSizeArray(partnerInfoStruct, 1)],
    ['token0AmountInKamino', u64],
    ['token1AmountInKamino', u64],
    ['withdrawnKaminoProfitToken0', u64],
    ['withdrawnKaminoProfitToken1', u64],
  ],
  (args) => args as PoolState
);

export enum PartnerType {
  AssetDash,
} // Enum type for PartnerType

export type UserPoolLiquidity = {
  accountDiscriminator: number[];
  user: PublicKey;
  poolState: PublicKey;
  token0Deposited: BigNumber;
  token1Deposited: BigNumber;
  token0Withdrawn: BigNumber;
  token1Withdrawn: BigNumber;
  lpTokensOwned: BigNumber;
  partner: PartnerType; // Optional field
  padding: number[]; // Array of 23 bytes
};

export const userPoolLiquidityStruct = new BeetStruct<UserPoolLiquidity>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['user', publicKey],
    ['poolState', publicKey],
    ['token0Deposited', u128],
    ['token1Deposited', u128],
    ['token0Withdrawn', u128],
    ['token1Withdrawn', u128],
    ['lpTokensOwned', u128],
    ['partner', u8], // Optional enum
    ['padding', uniformFixedSizeArray(u8, 23)],
  ],
  (args) => args as UserPoolLiquidity
);
