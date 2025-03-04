import {
  NetworkIdType,
  PortfolioElement,
  PortfolioElementLabel,
  PortfolioElementTypeType,
  SourceRef,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Params } from './Params';
import { TokenPriceMap } from '../../TokenPriceMap';

export abstract class ElementBuilder {
  readonly type: PortfolioElementTypeType;
  readonly label: PortfolioElementLabel;
  name?: string;
  readonly platformId?: string;
  tags?: string[];
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
  link?: string;

  protected constructor(params: Params) {
    this.type = params.type;
    this.label = params.label;
    this.name = params.name;
    this.tags = params.tags;
    this.platformId = params.platformId;
    this.sourceRefs = params.sourceRefs;
    this.ref = params.ref;
    this.link = params.link;
  }

  addTag(tag: string) {
    if (!this.tags) this.tags = [];
    this.tags.push(tag);
  }

  setName(name: string) {
    this.name = name;
  }

  abstract tokenAddresses(): string[];

  abstract get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElement | null;
}
