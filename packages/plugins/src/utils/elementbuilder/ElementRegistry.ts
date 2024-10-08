import {
  NetworkIdType,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { ElementParams } from './ElementParams';
import { Cache } from '../../Cache';
import { ElementMultipleBuilder } from './ElementMultipleBuilder';
import { ElementLiquidityBuilder } from './ElementLiquidityBuilder';
import { ElementBorrowlendBuilder } from './ElementBorrowlendBuilder';

export class ElementRegistry {
  readonly networkId: NetworkIdType;
  readonly platformId: string;
  elements: ElementBuilder[];

  constructor(networkId: NetworkIdType, platformId: string) {
    this.networkId = networkId;
    this.platformId = platformId;
    this.elements = [];
  }
  addElementMultiple(
    params: Omit<ElementParams, 'type'>
  ): ElementMultipleBuilder {
    const elementBuilder = new ElementMultipleBuilder({
      type: PortfolioElementType.multiple,
      ...params,
    });
    this.elements.push(elementBuilder);
    return elementBuilder;
  }

  addElementLiquidity(
    params: Omit<ElementParams, 'type'>
  ): ElementLiquidityBuilder {
    const elementBuilder = new ElementLiquidityBuilder({
      type: PortfolioElementType.liquidity,
      ...params,
    });
    this.elements.push(elementBuilder);
    return elementBuilder;
  }

  addElementBorrowlend(
    params: Omit<ElementParams, 'type'>
  ): ElementBorrowlendBuilder {
    const elementBuilder = new ElementBorrowlendBuilder({
      type: PortfolioElementType.borrowlend,
      ...params,
    });
    this.elements.push(elementBuilder);
    return elementBuilder;
  }

  async getElements(cache: Cache): Promise<PortfolioElement[]> {
    const mints = this.elements.map((e) => e.mints()).flat();
    const tokenPrices = await cache.getTokenPricesAsMap(mints, this.networkId);

    return this.elements
      .map((e) => e.get(this.networkId, this.platformId, tokenPrices))
      .filter(
        (e) => e !== null && e.value && e.value > 0
      ) as PortfolioElement[];
  }
}
