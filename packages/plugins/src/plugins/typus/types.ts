/* eslint-disable @typescript-eslint/no-explicit-any */
import { ID } from '../../utils/sui/types/id';

export type DepositShare = {
  index: string;
  activeSubVaultUserShare: string;
  deactivatingSubVaultUserShare: string;
  inactiveSubVaultUserShare: string;
  warmupSubVaultUserShare: string;
  premiumSubVaultUserShare: string;
  incentiveShare: string;
};

export type DepositReceipt = {
  id: ID;
  index: string;
  metadata: string;
  u64_padding: any[];
  vid: string;
};

export type Vault = {
  active_share_supply: string;
  bcs_padding: any[];
  bid_token: Token;
  deactivating_share_supply: string;
  deposit_token: Token;
  fee_bp: string;
  fee_share_bp: string;
  has_next: boolean;
  id: ID;
  inactive_share_supply: string;
  incentive_share_supply: string;
  incentive_token: null;
  index: string;
  metadata: string;
  premium_share_supply: string;
  shared_fee_pool: null;
  u64_padding: any[];
  warmup_share_supply: string;
};

export type Token = {
  fields: Fields;
  type: string;
};

export type Fields = {
  name: string;
};
