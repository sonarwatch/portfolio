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
  name?: string;
  readonly platformId?: string;
  tags?: string[];

  protected constructor(params: ElementParams) {
    this.type = params.type;
    this.label = params.label;
    this.name = params.name;
    this.tags = params.tags;
    this.platformId = params.platformId;
  }

  addTag(tag: string) {
    if (!this.tags) this.tags = [];
    this.tags.push(tag);
  }

  setName(name: string) {
    this.name = name;
  }

  abstract mints(): string[];

  abstract get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElement | null;
}
