import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioAssetType,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
  reduceYieldItems,
  TokenPriceMap,
  YieldItem,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { LiquidityParams, Params } from './Params';
import { LiquidityBuilder } from './LiquidityBuilder';
import { TokenYieldMap } from '../../TokenYieldMap';

export class ElementLiquidityBuilder extends ElementBuilder {
  liquidities: LiquidityBuilder[];

  constructor(params: Params) {
    super(params);
    this.liquidities = [];
  }

  addLiquidity(params?: LiquidityParams) {
    const liquidityBuilder = new LiquidityBuilder(params);
    this.liquidities.push(liquidityBuilder);
    return liquidityBuilder;
  }

  tokenAddresses(): string[] {
    return this.liquidities.map((liquidity) => liquidity.mints()).flat();
  }

  override get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap,
    tokenYields: TokenYieldMap
  ): PortfolioElementLiquidity | null {
    const liquidities = this.liquidities
      .map((l) => l.get(networkId, tokenPrices, tokenYields))
      .filter((a) => a !== null) as PortfolioLiquidity[];

    if (liquidities.length === 0) return null;

    const value = getUsdValueSum(liquidities.map((asset) => asset.value));

    let netApy;
    if (this.netApy) netApy = this.netApy;
    else if (value) {
      const yieldItems: YieldItem[] = [];

      liquidities.forEach((liquidity, i) => {
        if (liquidity.yields[i] && liquidity.value) {
          yieldItems.push({
            apy: liquidity.yields[i].apy,
            value: liquidity.value,
          });
        }
        liquidity.assets.forEach((asset) => {
          if (
            asset.type === PortfolioAssetType.token &&
            asset.data.yield &&
            asset.value
          ) {
            yieldItems.push({
              apy: asset.data.yield.apy,
              value: asset.value,
            });
          }
        });
      });

      netApy = reduceYieldItems(yieldItems);
    }

    return {
      type: PortfolioElementType.liquidity,
      label: this.label,
      networkId,
      platformId: this.platformId || platformId,
      data: {
        liquidities,
      },
      value,
      name: this.name,
      tags: this.tags,
      netApy,
    };
  }
}
