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
  readonly name?: string;
  readonly tags?: string[];

  protected constructor(params: ElementParams) {
    this.type = params.type;
    this.label = params.label;
    this.name = params.name;
    this.tags = params.tags;
  }

  abstract mints(): string[];

  abstract dump(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElement | null;
}
