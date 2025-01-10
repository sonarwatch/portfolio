import { MarketStatsData } from './types';

export const calculateWeightedAPY = (marketStats: MarketStatsData) => {
  const {
    annualizedLpFeesPct,
    totalLiquditySy,
    totalLiqudityPt,
    underlyingYieldsPct,
    ytImpliedRateAnnualizedPct,
    annualizedFarmEmissionsPct,
  } = marketStats;
  const tradingFees = annualizedLpFeesPct;

  const totalLiquidity = totalLiquditySy + totalLiqudityPt;
  return totalLiquidity > 0
    ? underlyingYieldsPct * (totalLiquditySy / totalLiquidity) +
        ytImpliedRateAnnualizedPct * (totalLiqudityPt / totalLiquidity) +
        tradingFees +
        annualizedFarmEmissionsPct
    : 0;
};
