export type Market = {
  id: string;
  vault: {
    id: string;
    platform: string;
    niceName: string;
    mintAsset: string;
    start: number;
    duration: number;
    mintSy: string;
    mintPt: string;
    mintYt: string;
    decimals: number;
    totalSyDeposited: string;
    totalSyDepositedNormalized: number;
    syProgramId: string;
    escrowSyAddress: string;
    lastSeenSyExchangeRate: number;
    allTimeHighSyExchangeRate: number;
    ptSupply: string;
    interestFeeBps: number;
    annualizedPtYield: number;
    depositCap: number;
  };
  stats: MarketStatsData;
};

export type MarketStatsData = {
  currentPtPriceInAsset: number;
  lpPriceInAsset: number;
  annualizedLpFeesPct: number;
  totalLiquditySy: number;
  totalLiqudityPt: number;
  underlyingYieldsPct: number;
  ytImpliedRateAnnualizedPct: number;
  annualizedFarmEmissionsPct: number;
  syAmountPerLpShare: number;
  ptAmountPerLpShare: number;
  ptPriceInAsset: number;
  ptPriceInUsd: number;
  syPriceInAsset: number;
};

export type PtToken = {
  marketAddress: string;
  vaultAddress: string;
  mint: string;
  priceInBaseAsset: number;
  priceInUsd: number;
  endDate: string;
  decimals: number;
  baseAssetMint: string;
};
