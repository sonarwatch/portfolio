import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
  bool,
  u16,
  u32,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export type WithdrawRequest = {
  shares: BigNumber;
  value: BigNumber;
  ts: BigNumber;
};

export const withdrawRequestStruct = new BeetStruct<WithdrawRequest>(
  [
    ['shares', u128],
    ['value', u64],
    ['ts', i64],
  ],
  (args) => args as WithdrawRequest
);

export type VaultDepositor = {
  buffer: Buffer;
  vault: PublicKey;
  pubkey: PublicKey;
  authority: PublicKey;
  vaultShares: BigNumber;
  lastWithdrawRequest: WithdrawRequest;
  lastValidTs: BigNumber;
  netDeposits: BigNumber;
  totalDeposits: BigNumber;
  totalWithdraws: BigNumber;
  cumulativeProfitShareAmount: BigNumber;
  profitShareFeePaid: BigNumber;
  vaultSharesBase: number;
  padding1: number;
  padding: BigNumber[];
};

export const vaultDepositorStruct = new BeetStruct<VaultDepositor>(
  [
    ['buffer', blob(8)],
    ['vault', publicKey],
    ['pubkey', publicKey],
    ['authority', publicKey],
    ['vaultShares', u128],
    ['lastWithdrawRequest', withdrawRequestStruct],
    ['lastValidTs', i64],
    ['netDeposits', i64],
    ['totalDeposits', u64],
    ['totalWithdraws', u64],
    ['cumulativeProfitShareAmount', i64],
    ['profitShareFeePaid', u64],
    ['vaultSharesBase', u32],
    ['padding1', u32],
    ['padding', uniformFixedSizeArray(u64, 8)],
  ],
  (args) => args as VaultDepositor
);

export type Vault = {
  buffer: Buffer;
  name: number[];
  pubkey: PublicKey;
  manager: PublicKey;
  tokenAccount: PublicKey;
  userStats: PublicKey;
  user: PublicKey;
  delegate: PublicKey;
  liquidationDelegate: PublicKey;
  userShares: BigNumber;
  totalShares: BigNumber;
  lastFeeUpdateTs: BigNumber;
  liquidationStartTs: BigNumber;
  redeemPeriod: BigNumber;
  totalWithdrawRequested: BigNumber;
  maxTokens: BigNumber;
  managementFee: BigNumber;
  initTs: BigNumber;
  netDeposits: BigNumber;
  managerNetDeposits: BigNumber;
  totalDeposits: BigNumber;
  totalWithdraws: BigNumber;
  managerTotalDeposits: BigNumber;
  managerTotalWithdraws: BigNumber;
  managerTotalFee: BigNumber;
  managerTotalProfitShare: BigNumber;
  minDepositAmount: BigNumber;
  lastManagerWithdrawRequest: WithdrawRequest;
  sharesBase: number;
  profitShare: number;
  hurdleRate: number;
  spotMarketIndex: number;
  bump: number;
  permissioned: boolean;
  padding: BigNumber[];
};

export const vaultStruct = new BeetStruct<Vault>(
  [
    ['buffer', blob(8)],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['pubkey', publicKey],
    ['manager', publicKey],
    ['tokenAccount', publicKey],
    ['userStats', publicKey],
    ['user', publicKey],
    ['delegate', publicKey],
    ['liquidationDelegate', publicKey],
    ['userShares', u128],
    ['totalShares', u128],
    ['lastFeeUpdateTs', i64],
    ['liquidationStartTs', i64],
    ['redeemPeriod', i64],
    ['totalWithdrawRequested', u64],
    ['maxTokens', u64],
    ['managementFee', i64],
    ['initTs', i64],
    ['netDeposits', i64],
    ['managerNetDeposits', i64],
    ['totalDeposits', u64],
    ['totalWithdraws', u64],
    ['managerTotalDeposits', u64],
    ['managerTotalWithdraws', u64],
    ['managerTotalFee', i64],
    ['managerTotalProfitShare', u64],
    ['minDepositAmount', u64],
    ['lastManagerWithdrawRequest', withdrawRequestStruct],
    ['sharesBase', u32],
    ['profitShare', u32],
    ['hurdleRate', u32],
    ['spotMarketIndex', u16],
    ['bump', u8],
    ['permissioned', bool],
    ['padding', uniformFixedSizeArray(u64, 8)],
  ],
  (args) => args as Vault
);
