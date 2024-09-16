import {
  NetworkIdType,
  PortfolioElement,
  PortfolioElementLabel,
  PortfolioElementTypeType,
} from '@sonarwatch/portfolio-core';
import { ElementParams } from './ElementParams';
import { TokenPriceMap } from '../../TokenPriceMap';

export abstract class ElementBuilder {
  readonly type: PortfolioElementTypeType;
  readonly label: PortfolioElementLabel;

  protected constructor(params: ElementParams) {
    this.type = params.type;
    this.label = params.label;
  }

  abstract mints(): string[];

  abstract export(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElement | null;
}
