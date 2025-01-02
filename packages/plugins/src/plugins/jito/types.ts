export type ClaimStatus = {
  status: string;
  total_unlocked_staker: number;
  total_locked_staker: number;
  total_unlocked_searcher: number;
  total_locked_searcher: number;
  total_unlocked_validator: number;
  total_locked_validator: number;
  amount_locked_withdrawable: number;
  amount_locked_withdrawn: number;
};

export type RestakingVaultInfo = {
  pubkey: string;
  vrtMint: string;
  platformId?: string;
};
