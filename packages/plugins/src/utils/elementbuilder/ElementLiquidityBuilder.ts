import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioElement,
  PortfolioElementLiquidity,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { ElementParams } from './ElementParams';
import { TokenPriceMap } from '../../TokenPriceMap';
import { LiquidityBuilder } from './LiquidityBuilder';
import { LiquidityParams } from './LiquidityParams';

export class ElementLiquidityBuilder extends ElementBuilder {
  liquidities: LiquidityBuilder[];

  constructor(params: ElementParams) {
    super(params);
    this.liquidities = [];
  }

  addLiquidity(params?: LiquidityParams) {
    const liquidityBuilder = new LiquidityBuilder(params);
    this.liquidities.push(liquidityBuilder);
    return liquidityBuilder;
  }

  mints(): string[] {
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

    const element = {
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
      ref: this.ref?.toString(),
      sourceRefs: this.sourceRefs,
      link: this.link,
    };

    return element as PortfolioElementLiquidity;
  }
}
