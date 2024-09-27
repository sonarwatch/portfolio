import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { BeetStruct, bool, u8 } from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { blob, i64, u64 } from '../../utils/solana';

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
