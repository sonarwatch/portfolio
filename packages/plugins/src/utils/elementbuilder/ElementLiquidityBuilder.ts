import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPriceMap,
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

    return {
      type: PortfolioElementType.liquidity,
      label: this.label,
      networkId,
      platformId: this.platformId || platformId,
      data: {
        liquidities,
      },
      value: getUsdValueSum(liquidities.map((asset) => asset.value)),
      name: this.name,
      tags: this.tags,
    };
  }
}
