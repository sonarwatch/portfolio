import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioAsset,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { AssetTokenBuilder } from './AssetTokenBuilder';
import {
  Params,
  PortfolioAssetGenericParams,
  PortfolioAssetTokenParams,
} from './Params';
import { TokenPriceMap } from '../../TokenPriceMap';
import { AssetBuilder } from './AssetBuilder';
import { AssetGenericBuilder } from './AssetGenericBuilder';

export class ElementMultipleBuilder extends ElementBuilder {
  assets: AssetBuilder[];

  constructor(params: Params) {
    super(params);
    this.assets = [];
  }

  addAsset(params: PortfolioAssetTokenParams) {
    this.assets.push(new AssetTokenBuilder(params));
  }

  addGenericAsset(params: PortfolioAssetGenericParams) {
    this.assets.push(new AssetGenericBuilder(params));
  }

  tokenAddresses(): string[] {
    return [...this.assets.map((a) => a.tokenAddresses())].flat();
  }

  get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElementMultiple | null {
    const assets = this.assets
      .map((a) => a.get(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];

    if (assets.length === 0) return null;

    return {
      type: PortfolioElementType.multiple,
      label: this.label,
      networkId,
      platformId: this.platformId || platformId,
      data: {
        assets,
        ref: this.ref?.toString(),
        sourceRefs: this.sourceRefs,
        link: this.link,
      },
      value: getUsdValueSum(assets.map((asset) => asset.value)),
      name: this.name,
      tags: this.tags,
    };
  }
}
