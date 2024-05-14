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

export type ID = {
  id: string;
};
