import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  array,
  BeetStruct,
  bool,
  FixableBeetStruct,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, i64, u64 } from '../../utils/solana';

export type RoleAccount = {
  buffer: Buffer;
  user: PublicKey;
  organization: PublicKey;
  type: number;
};

export const roleAccountStruct = new BeetStruct<RoleAccount>(
  [
    ['buffer', blob(8)],
    ['user', publicKey],
    ['organization', publicKey],
    ['type', u32],
  ],
  (args) => args as RoleAccount
);

export type LoanVault = {
  buffer: Buffer;
  order: PublicKey;
  lender: PublicKey;
  borrower: PublicKey;
  collateral: PublicKey;
  debt_note: PublicKey;
  credit_note: PublicKey;
  credit_claimed: boolean;
  debt_claimed: boolean;
  loan_start_time: BigNumber;
  num_fees_outstanding: BigNumber;
  fees_received: BigNumber;
};

export const loanVaultStruct = new BeetStruct<LoanVault>(
  [
    ['buffer', blob(8)],
    ['order', publicKey],
    ['lender', publicKey],
    ['borrower', publicKey],
    ['collateral', publicKey],
    ['debt_note', publicKey],
    ['credit_note', publicKey],
    ['credit_claimed', bool],
    ['debt_claimed', bool],
    ['loan_start_time', i64],
    ['num_fees_outstanding', u64],
    ['fees_received', u64],
  ],
  (args) => args as LoanVault
);

export type EscrowAccount = {
  buffer: Buffer;
  organization_identifier: PublicKey;
  num_escrowed: BigNumber;
  nonce: PublicKey;
  origination_cap: BigNumber;
  cumulative_amount_originated: BigNumber;
  external_yield_source: number;
};

export const escrowAccountStruct = new BeetStruct<EscrowAccount>(
  [
    ['buffer', blob(8)],
    ['organization_identifier', publicKey],
    ['num_escrowed', u64],
    ['nonce', publicKey],
    ['origination_cap', u64],
    ['cumulative_amount_originated', u64],
    ['external_yield_source', u8],
  ],
  (args) => args as EscrowAccount
);

export type Order = {
  buffer: Buffer;
  version: number;
  nonce: PublicKey;
  maker: PublicKey;
  designated_taker: PublicKey;
  principal_mint: PublicKey;
  principal_amount: BigNumber;
  collateral_mint: PublicKey;
  collateral_amount: BigNumber;
  maker_role: number;
  last_updated_slot: BigNumber;
  max_outstanding_payments: BigNumber;
  last_payment_id: BigNumber;
  final_payment_id: BigNumber;
  final_payment_time_offset: BigNumber;
  status: number;
  default_type: number;
  created_at: BigNumber;
  funding_type: number;
  allow_early_repayments: boolean;
  origination_fee: BigNumber;
  liquidation_manager: PublicKey;
  market_manager: PublicKey;
  liquidation_threshold: BigNumber;
  refinance_enabled: boolean;
  max_refinance_apy: BigNumber;
  refinance_duration: BigNumber;
  refinance_duration_type: number;
};

export const orderStruct = new BeetStruct<Order>(
  [
    ['buffer', blob(8)],
    ['version', u8],
    ['nonce', publicKey],
    ['maker', publicKey],
    ['designated_taker', publicKey],
    ['principal_mint', publicKey],
    ['principal_amount', u64],
    ['collateral_mint', publicKey],
    ['collateral_amount', u64],
    ['maker_role', u8],
    ['last_updated_slot', u64],
    ['max_outstanding_payments', u64],
    ['last_payment_id', u64],
    ['final_payment_id', u64],
    ['final_payment_time_offset', i64],
    ['status', u8],
    ['default_type', u8],
    ['created_at', i64],
    ['funding_type', u8],
    ['allow_early_repayments', bool],
    ['origination_fee', u64],
    ['liquidation_manager', publicKey],
    ['market_manager', publicKey],
    ['liquidation_threshold', u64],
    ['refinance_enabled', bool],
    ['max_refinance_apy', u64],
    ['refinance_duration', i64],
    ['refinance_duration_type', u8],
  ],
  (args) => args as Order
);

export type Ledger = {
  ledger_id: BigNumber;
  principal_due: BigNumber;
  principal_repaid: BigNumber;
  interest_due: BigNumber;
  interest_repaid: BigNumber;
  due_time_offset: BigNumber;
  paid_time: BigNumber;
  payment_type: number;
  is_filled: boolean;
  grace_period: BigNumber;
  late_payment_fee: BigNumber;
  early_payment_fee: BigNumber;
  payment_window: BigNumber;
  reserve: number[];
};

export const ledgerStruct = new BeetStruct<Ledger>(
  [
    ['ledger_id', u64],
    ['principal_due', u64],
    ['principal_repaid', u64],
    ['interest_due', u64],
    ['interest_repaid', u64],
    ['due_time_offset', i64],
    ['paid_time', i64],
    ['payment_type', u8],
    ['is_filled', bool],
    ['grace_period', i64],
    ['late_payment_fee', u64],
    ['early_payment_fee', u64],
    ['payment_window', i64],
    ['reserve', uniformFixedSizeArray(u8, 32)],
  ],
  (args) => args as Ledger
);

export type OrderLedger = {
  buffer: Buffer;
  version: number;
  order: PublicKey;
  ledgers: Ledger[];
};

export const orderLedgerStruct = new FixableBeetStruct<OrderLedger>(
  [
    ['buffer', blob(8)],
    ['version', u8],
    ['order', publicKey],
    ['ledgers', array(ledgerStruct)],
  ],
  (args) => args as OrderLedger
);

export type Lockbox = {
  buffer: Buffer;
  nonce: PublicKey;
  name: Buffer;
  initialization_time: BigNumber;
  nft_mint: PublicKey;
  state: number;
};
export const lockboxStruct = new FixableBeetStruct<Lockbox>(
  [
    ['buffer', blob(8)],
    ['nonce', publicKey],
    ['name', blob(24)],
    ['initialization_time', i64],
    ['nft_mint', publicKey],
    ['state', u8],
  ],
  (args) => args as Lockbox
);

// V2
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
