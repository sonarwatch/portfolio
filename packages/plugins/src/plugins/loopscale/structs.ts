import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  BeetStruct,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { u64 } from '../../utils/solana';

export type PodU32 = {
  array: number[];
};
export const podU32Struct = new BeetStruct<PodU32>(
  [['array', uniformFixedSizeArray(u8, 4)]],
  (args) => args as PodU32
);

export type Duration = {
  duration: PodU32;
  duration_type: number;
};
export const durationStruct = new BeetStruct<Duration>(
  [
    ['duration', podU32Struct],
    ['duration_type', u8],
  ],
  (args) => args as Duration
);

export type PodDecimal = {
  array: number[];
};
export const podDecimalStruct = new BeetStruct<PodDecimal>(
  [['array', uniformFixedSizeArray(u8, 24)]],
  (args) => args as PodDecimal
);
export type PodU128 = {
  array: number[];
};
export const podU128Struct = new BeetStruct<PodU128>(
  [['array', uniformFixedSizeArray(u8, 16)]],
  (args) => args as PodU128
);

export type PodU32CBPS = {
  array: number[];
};
export const podU32CBPSStruct = new BeetStruct<PodU32CBPS>(
  [['array', uniformFixedSizeArray(u8, 4)]],
  (args) => args as PodU32CBPS
);
export type PodU64 = {
  array: number[];
};
export const podU64Struct = new BeetStruct<PodU64>(
  [['array', uniformFixedSizeArray(u8, 8)]],
  (args) => args as PodU64
);

export type PodU64CBPS = {
  array: number[];
};
export const podU64CBPSStruct = new BeetStruct<PodU64CBPS>(
  [['array', uniformFixedSizeArray(u8, 8)]],
  (args) => args as PodU64CBPS
);

export type PodBool = {
  value: number;
};
export const podBoolStruct = new BeetStruct<PodBool>(
  [['value', u8]],
  (args) => args as PodBool
);

export type Vault = {
  accountDiscriminator: number[];
  manager: PublicKey;
  nonce: PublicKey;
  bump: number;
  lp_supply: PodU64;
  lp_mint: PublicKey;
  principal_mint: PublicKey;
  cumulative_principal_deposited: PodU64;
  deposits_enabled: PodBool;
  max_early_unstake_fee: PodU64CBPS;
};
export const vaultStruct = new BeetStruct<Vault>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['manager', publicKey],
    ['nonce', publicKey],
    ['bump', u8],
    ['lp_supply', podU64Struct],
    ['lp_mint', publicKey],
    ['principal_mint', publicKey],
    ['cumulative_principal_deposited', podU64Struct],
    ['deposits_enabled', podBoolStruct],
    ['max_early_unstake_fee', podU64CBPSStruct],
  ],
  (args) => args as Vault
);

export type VaultStake = {
  accountDiscriminator: number[];
  vault: PublicKey;
  nonce: PublicKey;
  bump: number;
  user: PublicKey;
  amount: PodU64;
  duration: Duration;
  start_time: PodU64;
  end_time: PodU64;
  unstake_time: PodU64;
  unstake_fee_applied: PodU64;
};
export const vaultStakeStruct = new BeetStruct<VaultStake>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['vault', publicKey],
    ['nonce', publicKey],
    ['bump', u8],
    ['user', publicKey],
    ['amount', podU64Struct],
    ['duration', durationStruct],
    ['start_time', podU64Struct],
    ['end_time', podU64Struct],
    ['unstake_time', podU64Struct],
    ['unstake_fee_applied', podU64Struct],
  ],
  (args) => args as VaultStake
);

export type Ledger = {
  status: number;
  strategy: PublicKey;
  principal_mint: PublicKey;
  market_information: PublicKey;
  principal_due: PodU64;
  principal_repaid: PodU64;
  interest_due: PodU64;
  interest_repaid: PodU64;
  duration: Duration;
  interest_per_second: PodDecimal;
  start_time: PodU64;
  end_time: PodU64;
  apy: PodU64CBPS;
};

export const ledgerStruct = new BeetStruct<Ledger>(
  [
    ['status', u8],
    ['strategy', publicKey],
    ['principal_mint', publicKey],
    ['market_information', publicKey],
    ['principal_due', podU64Struct],
    ['principal_repaid', podU64Struct],
    ['interest_due', podU64Struct],
    ['interest_repaid', podU64Struct],
    ['duration', durationStruct],
    ['interest_per_second', podDecimalStruct],
    ['start_time', podU64Struct],
    ['end_time', podU64Struct],
    ['apy', podU64CBPSStruct],
  ],
  (args) => args as Ledger
);

export type Strategy = {
  accountDiscriminator: number[];
  version: number;
  nonce: PublicKey;
  bump: number;
  principal_mint: PublicKey;
  lender: PublicKey;
  originations_enabled: PodBool;
  external_yield_source: number;
  interest_per_second: PodDecimal;
  last_accrued_timestamp: PodU64;
  liquidity_buffer: PodU64CBPS;
  token_balance: PodU64;
  interest_fee: PodU64CBPS;
  principal_fee: PodU64CBPS;
  origination_fee: PodU64CBPS;
  origination_cap: PodU64;
  external_yield_amount: PodU64;
  current_deployed_amount: PodU64;
  outstanding_interest_amount: PodU64;
  fee_claimable: PodU64;
  cumulative_principal_originated: PodU128;
  cumulative_interest_accrued: PodU128;
  cumulative_loan_count: PodU64;
  active_loan_count: PodU64;
  market_information: PublicKey;
  collateral_map: PodU64[][];
};
export const strategyStruct = new BeetStruct<Strategy>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['nonce', publicKey],
    ['bump', u8],
    ['principal_mint', publicKey],
    ['lender', publicKey],
    ['originations_enabled', podBoolStruct],
    ['external_yield_source', u8],
    ['interest_per_second', podDecimalStruct],
    ['last_accrued_timestamp', podU64Struct],
    ['liquidity_buffer', podU64CBPSStruct],
    ['token_balance', podU64Struct],
    ['interest_fee', podU64CBPSStruct],
    ['principal_fee', podU64CBPSStruct],
    ['origination_fee', podU64CBPSStruct],
    ['origination_cap', podU64Struct],
    ['external_yield_amount', podU64Struct],
    ['current_deployed_amount', podU64Struct],
    ['outstanding_interest_amount', podU64Struct],
    ['fee_claimable', podU64Struct],
    ['cumulative_principal_originated', podU128Struct],
    ['cumulative_interest_accrued', podU128Struct],
    ['cumulative_loan_count', podU64Struct],
    ['active_loan_count', podU64Struct],
    ['market_information', publicKey],
    [
      'collateral_map',
      uniformFixedSizeArray(uniformFixedSizeArray(podU64Struct, 5), 200),
    ],
  ],
  (args) => args as Strategy
);

export type CollateralData = {
  asset_mint: PublicKey;
  amount: PodU64;
  asset_type: number;
  asset_identifier: PublicKey;
};

export const collateralDataStruct = new BeetStruct<CollateralData>(
  [
    ['asset_mint', publicKey],
    ['amount', podU64Struct],
    ['asset_type', u8],
    ['asset_identifier', publicKey],
  ],
  (args) => args as CollateralData
);

export enum LoanType {
  Borrowing = 0,
  Unknown = 1,
  YieldLoop = 2,
}

export type Loan = {
  accountDiscriminator: number[];
  version: number;
  bump: number;
  loan_type: LoanType;
  borrower: PublicKey;
  nonce: BigNumber;
  start_time: PodU64;
  ledgers: Ledger[];
  collateral: CollateralData[];
  weight_matrix: PodU32CBPS[][];
  ltv_matrix: PodU32CBPS[][];
  lqt_matrix: PodU32CBPS[][];
};
export const loanStruct = new BeetStruct<Loan>(
  [
    ['accountDiscriminator', uniformFixedSizeArray(u8, 8)],
    ['version', u8],
    ['bump', u8],
    ['loan_type', u8],
    ['borrower', publicKey],
    ['nonce', u64],
    ['start_time', podU64Struct],
    ['ledgers', uniformFixedSizeArray(ledgerStruct, 5)],
    ['collateral', uniformFixedSizeArray(collateralDataStruct, 5)],
    [
      'weight_matrix',
      uniformFixedSizeArray(uniformFixedSizeArray(podU32CBPSStruct, 5), 5),
    ],
    [
      'ltv_matrix',
      uniformFixedSizeArray(uniformFixedSizeArray(podU32CBPSStruct, 5), 5),
    ],
    [
      'lqt_matrix',
      uniformFixedSizeArray(uniformFixedSizeArray(podU32CBPSStruct, 5), 5),
    ],
  ],
  (args) => args as Loan
);
