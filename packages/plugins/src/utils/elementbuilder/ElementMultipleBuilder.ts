import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioAsset,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
  reduceYieldItems,
  TokenPriceMap,
  YieldItem,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { AssetTokenBuilder } from './AssetTokenBuilder';
import {
  Params,
  PortfolioAssetGenericParams,
  PortfolioAssetPricedTokenParams,
  PortfolioAssetTokenParams,
} from './Params';
import { AssetBuilder } from './AssetBuilder';
import { AssetGenericBuilder } from './AssetGenericBuilder';
import { TokenYieldMap } from '../../TokenYieldMap';
import { AssetPricedTokenBuilder } from './AssetPricedTokenBuilder';

export class ElementMultipleBuilder extends ElementBuilder {
  assets: AssetBuilder[];

  constructor(params: Params) {
    super(params);
    this.assets = [];
  }

  addAsset(params: PortfolioAssetTokenParams) {
    this.assets.push(new AssetTokenBuilder(params));
  }

  addPricedAsset(params: PortfolioAssetPricedTokenParams) {
    this.assets.push(new AssetPricedTokenBuilder(params));
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
    tokenPrices: TokenPriceMap,
    tokenYields: TokenYieldMap
  ): PortfolioElementMultiple | null {
    const assets = this.assets
      .map((a) => a.get(networkId, tokenPrices, tokenYields))
      .filter((a) => a !== null) as PortfolioAsset[];

    if (assets.length === 0) return null;

    const value = getUsdValueSum(assets.map((asset) => asset.value));

    let netApy;
    if (this.netApy) netApy = this.netApy;
    else if (value) {
      const yieldItems: YieldItem[] = [];
      assets.forEach((asset) => {
        if (
          asset.type === PortfolioAssetType.token &&
          asset.data.yield &&
          asset.value
        ) {
          yieldItems.push({
            apy: asset.data.yield.apy,
            value: asset.value,
          });
        }
      });
      netApy = reduceYieldItems(yieldItems);
    }

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
      value,
      name: this.name,
      tags: this.tags,
      netApy,
    };
  }
}
