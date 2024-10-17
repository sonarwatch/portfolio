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
  readonly leveraged?: boolean;

  protected constructor(params: ElementParams) {
    this.type = params.type;
    this.label = params.label;
    this.name = params.name;
    this.tags = params.tags;
    this.leveraged = params.leveraged;
  }

  abstract mints(): string[];

  abstract get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElement | null;
}
