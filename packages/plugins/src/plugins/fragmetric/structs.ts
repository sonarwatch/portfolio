import {
  array,
  BeetStruct,
  FixableBeetStruct,
  u16,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u64 } from '../../utils/solana';

enum TokenPricingSource {
  SPLStakePool,
  MarinadeStakePool,
  JitoRestakingVault,
  FragmetricNormalizedTokenPool,
  FragmetricRestakingFund,
  OrcaDEXLiquidityPool,
  SanctumSingleValidatorSPLStakePool,
}

export type WithdrawalBatch = {
  batch_id: BigNumber;
  num_requests: BigNumber;
  receipt_token_amount: BigNumber;
  enqueued_at: BigNumber;
  _reserved: number[];
};

export const WithdrawalBatchStruct = new BeetStruct<WithdrawalBatch>(
  [
    ['batch_id', u64],
    ['num_requests', u64],
    ['receipt_token_amount', u64],
    ['enqueued_at', i64],
    ['_reserved', uniformFixedSizeArray(u8, 32)],
  ],
  (args) => args as WithdrawalBatch
);

export type AssetState = {
  token_mint: PublicKey;
  token_program: PublicKey;
  accumulated_deposit_capacity_amount: BigNumber;
  accumulated_deposit_amount: BigNumber;
  depositable: number;
  _padding: number[];
  withdrawable: number;
  normal_reserve_rate_bps: number;
  normal_reserve_max_amount: BigNumber;
  withdrawal_last_created_request_id: BigNumber;
  withdrawal_last_processed_batch_id: BigNumber;
  withdrawal_last_batch_enqueued_at: BigNumber;
  withdrawal_last_batch_processed_at: BigNumber;
  withdrawal_pending_batch: WithdrawalBatch;
  _padding2: number[];
  withdrawal_num_queued_batches: number;
  withdrawal_queued_batches: WithdrawalBatch[];
  _reserved: number[];
  withdrawable_value_as_receipt_token_amount: BigNumber;
  withdrawal_user_reserved_amount: BigNumber;
  operation_receivable_amount: BigNumber;
  operation_reserved_amount: BigNumber;
};

export const AssetStateStruct = new BeetStruct<AssetState>(
  [
    ['token_mint', publicKey],
    ['token_program', publicKey],
    ['accumulated_deposit_capacity_amount', u64],
    ['accumulated_deposit_amount', u64],
    ['depositable', u8],
    ['_padding', uniformFixedSizeArray(u8, 4)],
    ['withdrawable', u8],
    ['normal_reserve_rate_bps', u16],
    ['normal_reserve_max_amount', u64],
    ['withdrawal_last_created_request_id', u64],
    ['withdrawal_last_processed_batch_id', u64],
    ['withdrawal_last_batch_enqueued_at', i64],
    ['withdrawal_last_batch_processed_at', i64], // 128
    ['withdrawal_pending_batch', WithdrawalBatchStruct], // 192
    ['_padding2', uniformFixedSizeArray(u8, 15)],
    ['withdrawal_num_queued_batches', u8], // 208
    [
      'withdrawal_queued_batches',
      uniformFixedSizeArray(WithdrawalBatchStruct, 10),
    ], // = 64 * 10  (640+208 = 848)
    ['_reserved', uniformFixedSizeArray(u8, 56)],
    ['withdrawable_value_as_receipt_token_amount', u64],
    ['withdrawal_user_reserved_amount', u64],
    ['operation_receivable_amount', u64],
    ['operation_reserved_amount', u64],
  ],
  (args) => args as AssetState
);

export type TokenPricingSourcePod = {
  discriminant: number;
  _padding: number[];
  address: PublicKey;
};

export const TokenPricingSourcePodStruct =
  new BeetStruct<TokenPricingSourcePod>(
    [
      ['discriminant', u8],
      ['_padding', uniformFixedSizeArray(u8, 7)],
      ['address', publicKey],
    ],
    (args) => args as TokenPricingSourcePod
  );

export type SupportedToken = {
  mint: PublicKey;
  program: PublicKey;
  decimals: number;
  _padding: number[];
  pricing_source: TokenPricingSourcePod;
  one_token_as_sol: BigNumber;
  token: AssetState;
  rebalancing_amount: BigNumber;
  sol_allocation_weight: BigNumber;
  sol_allocation_capacity_amount: BigNumber;
  pending_unstaking_amount_as_sol: BigNumber;
  one_token_as_receipt_token: BigNumber;
  _reserved: number[];
};

export const supportedTokenStruct = new BeetStruct<SupportedToken>(
  [
    ['mint', publicKey],
    ['program', publicKey],
    ['decimals', u8],
    ['_padding', uniformFixedSizeArray(u8, 7)],
    ['pricing_source', TokenPricingSourcePodStruct],
    ['one_token_as_sol', u64], // 120
    ['token', AssetStateStruct],
    ['rebalancing_amount', u64],
    ['sol_allocation_weight', u64],
    ['sol_allocation_capacity_amount', u64],
    ['pending_unstaking_amount_as_sol', u64],
    ['one_token_as_receipt_token', u64],
    ['_reserved', uniformFixedSizeArray(u8, 48)],
  ],
  (args) => args as SupportedToken
);

export type NormalizedToken = {
  mint: PublicKey;
  program: PublicKey;
  decimals: number;
  enabled: number;
  _padding: number[];
  pricing_source: TokenPricingSourcePod;
  one_token_as_sol: BigNumber;
  operation_reserved_amount: BigNumber;
  _reserved: number[];
};

export const normalizedTokenStruct = new BeetStruct<NormalizedToken>( // 192
  [
    ['mint', publicKey],
    ['program', publicKey],
    ['decimals', u8],
    ['enabled', u8],
    ['_padding', uniformFixedSizeArray(u8, 6)],
    ['pricing_source', TokenPricingSourcePodStruct], // = 40
    ['one_token_as_sol', u64],
    ['operation_reserved_amount', u64],
    ['_reserved', uniformFixedSizeArray(u8, 64)],
  ],
  (args) => args as NormalizedToken
);

export type NormalizedSupportedToken = {
  mint: PublicKey;
  program: PublicKey;
  reserve_account: PublicKey;
  locked_amount: BigNumber;
  decimals: number;
  withdrawal_reserved_amount: BigNumber;
  one_token_as_sol: BigNumber;
  pricing_source: TokenPricingSource;
  pricing_source_account: PublicKey;
  _reserved: number[];
};

export const normalizedSupportedTokenStruct =
  new BeetStruct<NormalizedSupportedToken>(
    [
      ['mint', publicKey],
      ['program', publicKey],
      ['reserve_account', publicKey],
      ['locked_amount', u64],
      ['decimals', u8],
      ['withdrawal_reserved_amount', u64],
      ['one_token_as_sol', u64],
      ['pricing_source', u8],
      ['pricing_source_account', publicKey],
      ['_reserved', uniformFixedSizeArray(u8, 14)],
    ],
    (args) => args as NormalizedSupportedToken
  );

export type NormalizedTokenPool = {
  buffer: Buffer;
  data_version: number;
  bump: number;
  normalized_token_mint: PublicKey;
  normalized_token_program: PublicKey;
  supported_tokens: NormalizedSupportedToken[];
  _reserved: number[];
};

export const normalizedTokenPoolStruct =
  new FixableBeetStruct<NormalizedTokenPool>(
    [
      ['buffer', blob(8)],
      ['data_version', u16],
      ['bump', u8],
      ['normalized_token_mint', publicKey],
      ['normalized_token_program', publicKey],
      ['supported_tokens', array(normalizedSupportedTokenStruct)],
      ['_reserved', uniformFixedSizeArray(u8, 128)],
    ],
    (args) => args as NormalizedTokenPool
  );

export type AssetPod = {
  discriminant: number;
  _padding: number[];
  sol_amount: BigNumber;
  token_amount: BigNumber;
  token_mint: PublicKey;
  token_pricing_source: TokenPricingSourcePod;
};

export const AssetPodStruct = new BeetStruct<AssetPod>(
  [
    ['discriminant', u8],
    ['_padding', uniformFixedSizeArray(u8, 7)],
    ['sol_amount', u64],
    ['token_amount', u64],
    ['token_mint', publicKey],
    ['token_pricing_source', TokenPricingSourcePodStruct], // 40
  ],
  (args) => args as AssetPod
);

export type TokenValuePod = {
  numerator: AssetPod[];
  num_numerator: BigNumber;
  denominator: BigNumber;
};

export const TokenValuePodStruct = new FixableBeetStruct<TokenValuePod>(
  [
    ['numerator', uniformFixedSizeArray(AssetPodStruct, 33)], // 3168
    ['num_numerator', u64],
    ['denominator', u64],
  ],
  (args) => args as TokenValuePod
);

export type RestakingVaultDelegation = {
  operator: PublicKey;
  supported_token_allocation_weight: BigNumber;
  supported_token_allocation_capacity_amount: BigNumber;
  supported_token_delegated_amount: BigNumber;
  supported_token_undelegating_amount: BigNumber;
  supported_token_redelegating_amount: BigNumber;
  _reserved: number[];
};

export const RestakingVaultDelegationStruct =
  new BeetStruct<RestakingVaultDelegation>(
    [
      ['operator', publicKey],
      ['supported_token_allocation_weight', u64],
      ['supported_token_allocation_capacity_amount', u64],
      ['supported_token_delegated_amount', u64],
      ['supported_token_undelegating_amount', u64],
      ['supported_token_redelegating_amount', u64],
      ['_reserved', uniformFixedSizeArray(u8, 24)],
    ],
    (args) => args as RestakingVaultDelegation
  );

export type RestakingVault = {
  vault: PublicKey;
  program: PublicKey;
  supported_token_mint: PublicKey;
  receipt_token_mint: PublicKey;
  receipt_token_program: PublicKey;
  receipt_token_decimals: number;
  _padding: number[];
  one_receipt_token_as_sol: BigNumber;
  receipt_token_pricing_source: TokenPricingSourcePod;
  receipt_token_operation_reserved_amount: BigNumber;
  receipt_token_operation_receivable_amount: BigNumber;
  sol_allocation_weight: BigNumber;
  sol_allocation_capacity_amount: BigNumber;
  _padding2: number[];
  num_delegations: number;
  delegations: RestakingVaultDelegation[];
  _padding3: number[];
  num_compounding_reward_tokens: number;
  compounding_reward_token_mints: PublicKey[];
  _reserved: number[];
};

export const RestakingVaultStruct = new BeetStruct<RestakingVault>(
  [
    ['vault', publicKey],
    ['program', publicKey],
    ['supported_token_mint', publicKey],
    ['receipt_token_mint', publicKey],
    ['receipt_token_program', publicKey],
    ['receipt_token_decimals', u8],
    ['_padding', uniformFixedSizeArray(u8, 7)],
    ['one_receipt_token_as_sol', u64],
    ['receipt_token_pricing_source', TokenPricingSourcePodStruct],
    ['receipt_token_operation_reserved_amount', u64],
    ['receipt_token_operation_receivable_amount', u64],
    ['sol_allocation_weight', u64],
    ['sol_allocation_capacity_amount', u64],
    ['_padding2', uniformFixedSizeArray(u8, 7)],
    ['num_delegations', u8],
    ['delegations', uniformFixedSizeArray(RestakingVaultDelegationStruct, 30)], // 30
    ['_padding3', uniformFixedSizeArray(u8, 7)],
    ['num_compounding_reward_tokens', u8],
    ['compounding_reward_token_mints', uniformFixedSizeArray(publicKey, 10)],
    ['_reserved', uniformFixedSizeArray(u8, 128)],
  ],
  (args) => args as RestakingVault
);

export type OperationCommandPod = {
  discriminant: number;
  buffer: number[];
};

export const OperationCommandPodStruct = new BeetStruct<OperationCommandPod>(
  [
    ['discriminant', u8],
    ['buffer', uniformFixedSizeArray(u8, 2535)],
  ],
  (args) => args as OperationCommandPod
);

export type OperationCommandAccountMetaPod = {
  pubkey: PublicKey;
  is_writable: number;
  _padding: number[];
};

export const OperationCommandAccountMetaPodStruct = new BeetStruct<
  OperationCommandAccountMetaPod,
  Partial<OperationCommandAccountMetaPod>
>(
  [
    ['pubkey', publicKey],
    ['is_writable', u8],
    ['_padding', uniformFixedSizeArray(u8, 7)],
  ],
  (args) => args as OperationCommandAccountMetaPod
);

export type OperationCommandEntryPod = {
  num_required_accounts: number;
  _padding: number[];
  required_accounts: OperationCommandAccountMetaPod[];
  command: OperationCommandPod;
};

export const OperationCommandEntryPodStruct =
  new FixableBeetStruct<OperationCommandEntryPod>(
    [
      ['num_required_accounts', u8],
      ['_padding', uniformFixedSizeArray(u8, 7)],
      [
        'required_accounts',
        uniformFixedSizeArray(OperationCommandAccountMetaPodStruct, 32),
      ], // 32
      ['command', OperationCommandPodStruct],
    ],
    (args) => args as OperationCommandEntryPod
  );

export type OperationState = {
  updated_slot: BigNumber;
  updated_at: BigNumber;
  expired_at: BigNumber;
  _padding: number[];
  no_transition: number;
  next_sequence: number;
  num_operated: BigNumber;
  next_command: OperationCommandEntryPod;
  _reserved: number[];
};

export const OperationStateStruct = new FixableBeetStruct<OperationState>(
  [
    ['updated_slot', u64],
    ['updated_at', i64],
    ['expired_at', i64],
    ['_padding', uniformFixedSizeArray(u8, 5)],
    ['no_transition', u8],
    ['next_sequence', u16],
    ['num_operated', u64],
    ['next_command', OperationCommandEntryPodStruct],
    ['_reserved', uniformFixedSizeArray(u8, 640)],
  ],
  (args) => args as OperationState
);

export type WrappedToken = {
  mint: PublicKey;
  program: PublicKey;
  decimals: number;
  enabled: number;
  _padding: number[];
  supply: BigNumber;
  _reserved: number[];
};

export const WrappedTokenStruct = new FixableBeetStruct<WrappedToken>(
  [
    ['mint', publicKey],
    ['program', publicKey],
    ['decimals', u8],
    ['enabled', u8],
    ['_padding', uniformFixedSizeArray(u8, 6)],
    ['supply', u64],
    ['_reserved', uniformFixedSizeArray(u8, 64)],
  ],
  (args) => args as WrappedToken
);

export type FundAccount = {
  buffer: Buffer;
  data_version: number;
  bump: number;
  reserve_account_bump: number;
  treasury_account_bump: number;
  wrap_account_bump: number;
  _padding: number[];
  transfer_enabled: number;
  address_lookup_table_enabled: number;
  address_lookup_table_account: PublicKey;
  reserve_account: PublicKey;
  treasury_account: PublicKey;
  receipt_token_mint: PublicKey;
  receipt_token_program: PublicKey;
  receipt_token_decimals: number;
  _padding2: number[];
  receipt_token_supply_amount: BigNumber;
  one_receipt_token_as_sol: BigNumber;
  receipt_token_value_updated_slot: BigNumber;
  receipt_token_value: TokenValuePod;
  withdrawal_batch_threshold_interval_seconds: BigNumber;
  withdrawal_fee_rate_bps: number;
  withdrawal_enabled: number;
  deposit_enabled: number;
  donation_enabled: number;
  _padding4: number[];
  sol: AssetState;
  _padding6: number[];
  num_supported_tokens: number;
  supported_tokens: SupportedToken[];
  normalized_token: NormalizedToken;
  _padding7: number[];
  num_restaking_vaults: number;
  restaking_vaults: RestakingVault[];
  operation: OperationState;
  wrap_account: PublicKey;
  wrapped_token: WrappedToken;
};

export const FundAccountStruct = new FixableBeetStruct<FundAccount>(
  [
    ['buffer', blob(8)],
    ['data_version', u16],
    ['bump', u8],
    ['reserve_account_bump', u8],
    ['treasury_account_bump', u8],
    ['wrap_account_bump', u8],
    ['_padding', uniformFixedSizeArray(u8, 8)],
    ['transfer_enabled', u8],
    ['address_lookup_table_enabled', u8],
    ['address_lookup_table_account', publicKey],
    ['reserve_account', publicKey],
    ['treasury_account', publicKey],

    ['receipt_token_mint', publicKey],
    ['receipt_token_program', publicKey],
    ['receipt_token_decimals', u8],
    ['_padding2', uniformFixedSizeArray(u8, 7)],
    ['receipt_token_supply_amount', u64],
    ['one_receipt_token_as_sol', u64],
    ['receipt_token_value_updated_slot', u64], // 216
    ['receipt_token_value', TokenValuePodStruct], // 3400
    ['withdrawal_batch_threshold_interval_seconds', i64],
    ['withdrawal_fee_rate_bps', u16],
    ['withdrawal_enabled', u8],
    ['deposit_enabled', u8],
    ['donation_enabled', u8],
    ['_padding4', uniformFixedSizeArray(u8, 3)], // 3416
    ['sol', AssetStateStruct], // = 936 (3416+936 = 4352)
    ['_padding6', uniformFixedSizeArray(u8, 15)],
    ['num_supported_tokens', u8], // 4368
    ['supported_tokens', uniformFixedSizeArray(supportedTokenStruct, 30)], // = 1144 * 30 (4368+1144 = 5512)
    ['normalized_token', normalizedTokenStruct], // = 192 (5512+192 = 5704)
    ['_padding7', uniformFixedSizeArray(u8, 15)],
    ['num_restaking_vaults', u8], // 5720
    ['restaking_vaults', uniformFixedSizeArray(RestakingVaultStruct, 30)], // 30
    ['operation', OperationStateStruct],
    ['wrap_account', publicKey],
    ['wrapped_token', WrappedTokenStruct],
  ],
  (args) => args as FundAccount
);
