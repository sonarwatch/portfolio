export type SplAssetMarket = {
  marketPubkey: string;
  collateral: { mint: string; decimals: number; name: string; ticker: string };
};

export type Collection = {
  marketPubkey: string;
  collectionName: string;
  collectionImage: string;
  collectionFloor: number;
  tensorSlug: string;
};

type AssetDetail = {
  mint: string;
  ticker: string;
  logoUrl: string;
};

type AssetAllocation = AssetDetail & {
  allocation: number;
  maxCapacity: number;
  apr: number;
  liquidationLtv: number;
  totalDepositedAmount: number;
  loansTvl: number;
  avgLtv: number;
};

type CuratorDetails = {
  name: string;
  description: string;
  xUrl: string;
};

export type Vault = {
  vaultPubkey: string;
  lendingToken: string;
  vaultName: string;
  lenderWalletPubkey: string;
  assetsDetails: AssetDetail[];
  totalDepositedAmount: number;
  maxCapacity: number;
  reserves: string;
  loansTvl: number;
  currentApy: number;
  targetApy: number;
  performance: number;
  curatorDetails: CuratorDetails;
  userTotalDepositedAmount: string;
  requestedWithdrawAmount: string;
  pendingClaimAmount: string;
  assetsAllocation: AssetAllocation[];
  pnl: number;
  totalPnl: number;
};
