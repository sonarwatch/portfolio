import {
  NetworkIdType,
  PortfolioElement,
  PortfolioElementLiquidity,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { ElementParams } from './ElementParams';
import { Cache } from '../../Cache';
import { ElementMultipleBuilder } from './ElementMultipleBuilder';
import { ElementLiquidityBuilder } from './ElementLiquidityBuilder';

export class ElementRegistry {
  readonly networkId: NetworkIdType;
  readonly platformId: string;
  elements: ElementBuilder[];

  constructor(networkId: NetworkIdType, platformId: string) {
    this.networkId = networkId;
    this.platformId = platformId;
    this.elements = [];
  }
  addMultiple(params: Omit<ElementParams, 'type'>): ElementMultipleBuilder {
    const elementBuilder = new ElementMultipleBuilder({
      type: PortfolioElementType.multiple,
      ...params,
    });
    this.elements.push(elementBuilder);
    return elementBuilder;
  }

  addLiquidity(params: Omit<ElementParams, 'type'>): ElementLiquidityBuilder {
    const elementBuilder = new ElementLiquidityBuilder({
      type: PortfolioElementType.liquidity,
      ...params,
    });
    this.elements.push(elementBuilder);
    return elementBuilder;
  }

  async export(cache: Cache): Promise<PortfolioElement[]> {
    const mints = this.elements.map((e) => e.mints()).flat();
    const tokenPrices = await cache.getTokenPricesAsMap(mints, this.networkId);

    return this.elements
      .map((e) => e.export(this.networkId, this.platformId, tokenPrices))
      .filter(
        (e) => e !== null && e.value && e.value > 0
      ) as PortfolioElement[];
  }
}
