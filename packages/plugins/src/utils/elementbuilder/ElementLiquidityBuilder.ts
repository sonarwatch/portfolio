import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioElement,
  PortfolioElementLiquidity,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { LiquidityParams, Params } from './Params';
import { TokenPriceMap } from '../../TokenPriceMap';
import { LiquidityBuilder } from './LiquidityBuilder';

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
    tokenPrices: TokenPriceMap
  ): PortfolioElement | null {
    const liquidities = this.liquidities
      .map((l) => l.get(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioLiquidity[];

    if (liquidities.length === 0) return null;

    return {
      type: this.type,
      label: this.label,
      networkId,
      platformId: this.platformId || platformId,
      data: {
        liquidities,
      },
      value: getUsdValueSum(liquidities.map((asset) => asset.value)),
      name: this.name,
      tags: this.tags,
    } as PortfolioElementLiquidity;
  }
}
