import {
  NetworkIdType,
  PortfolioElement,
  PortfolioElementLabel,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { Params } from './Params';
import { Cache } from '../../Cache';
import { ElementMultipleBuilder } from './ElementMultipleBuilder';
import { ElementLiquidityBuilder } from './ElementLiquidityBuilder';
import { ElementBorrowlendBuilder } from './ElementBorrowlendBuilder';
import { ElementLeverageBuilder } from './ElementLeverageBuilder';
import { ElementConcentratedLiquidityBuilder } from './ElementConcentratedLiquidityBuilder';
import { ElementTradeBuilder } from './ElementTradeBuilder';

export class ElementRegistry {
  readonly networkId: NetworkIdType;
  readonly platformId: string;
  elements: ElementBuilder[];

  constructor(networkId: NetworkIdType, platformId: string) {
    this.networkId = networkId;
    this.platformId = platformId;
    this.elements = [];
  }

  addElementMultiple(params: Omit<Params, 'type'>): ElementMultipleBuilder {
    const elementBuilder = new ElementMultipleBuilder({
      ...params,
      type: PortfolioElementType.multiple,
    });
    this.elements.push(elementBuilder);
    return elementBuilder;
  }

  addElementLiquidity(params: Omit<Params, 'type'>): ElementLiquidityBuilder {
    const elementBuilder = new ElementLiquidityBuilder({
      ...params,
      type: PortfolioElementType.liquidity,
    });
    this.elements.push(elementBuilder);
    return elementBuilder;
  }

  addElementConcentratedLiquidity(
    elementParams?: Omit<Params, 'type' | 'label'> & {
      label?: PortfolioElementLabel;
    }
  ): ElementConcentratedLiquidityBuilder {
    const elementBuilder = new ElementConcentratedLiquidityBuilder({
      ...elementParams,
      type: PortfolioElementType.liquidity,
      tags: [...(elementParams?.tags || []), 'Concentrated'],
      label: elementParams?.label || 'LiquidityPool',
    });
    this.elements.push(elementBuilder);
    return elementBuilder;
  }

  addElementBorrowlend(params: Omit<Params, 'type'>): ElementBorrowlendBuilder {
    const elementBuilder = new ElementBorrowlendBuilder({
      ...params,
      type: PortfolioElementType.borrowlend,
    });
    this.elements.push(elementBuilder);
    return elementBuilder;
  }

  addElementLeverage(params: Omit<Params, 'type'>): ElementLeverageBuilder {
    const elementBuilder = new ElementLeverageBuilder({
      ...params,
      type: PortfolioElementType.leverage,
    });
    this.elements.push(elementBuilder);
    return elementBuilder;
  }

  addElementTrade(params: Omit<Params, 'type'>): ElementTradeBuilder {
    const elementBuilder = new ElementTradeBuilder({
      ...params,
      type: PortfolioElementType.trade,
    });
    this.elements.push(elementBuilder);
    return elementBuilder;
  }

  async getElements(cache: Cache): Promise<PortfolioElement[]> {
    const mints = this.elements.map((e) => e.tokenAddresses()).flat();
    const tokenPrices = await cache.getTokenPricesAsMap(mints, this.networkId);

    return this.elements
      .map((e) => e.get(this.networkId, this.platformId, tokenPrices))
      .filter((e) => e !== null)
      .filter((e) => {
        if (
          e &&
          e.type === PortfolioElementType.borrowlend &&
          e.data.expireOn
        ) {
          return true;
        }
        return e && e.value && e.value > 0;
      }) as PortfolioElement[];
  }
}
