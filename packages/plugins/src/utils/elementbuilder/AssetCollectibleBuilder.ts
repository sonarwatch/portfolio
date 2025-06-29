import {
  fixUsdValue,
  NetworkIdType,
  PortfolioAssetCollectible,
  PortfolioAssetType,
  TokenPriceMap,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { AssetBuilder } from './AssetBuilder';
import { PortfolioAssetCollectibleParams } from './Params';

export class AssetCollectibleBuilder extends AssetBuilder {
  params: PortfolioAssetCollectibleParams;

  constructor(params: PortfolioAssetCollectibleParams) {
    super();
    this.params = params;
  }

  // eslint-disable-next-line class-methods-use-this
  tokenAddresses(): string[] {
    return [];
  }

  get(
    networkId: NetworkIdType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tokenPrices: TokenPriceMap
  ): PortfolioAssetCollectible | null {
    const amount = new BigNumber(this.params.amount || 1).toFixed(1);
    return {
      type: PortfolioAssetType.collectible,
      networkId,
      value: fixUsdValue(
        new BigNumber(this.params.collection.floorPrice)
          .multipliedBy(amount)
          .toNumber()
      ),
      name: this.params.name || this.params.collection.name,
      data: {
        address: this.params.address.toString(),
        amount: Number(amount),
        price: new BigNumber(this.params.collection.floorPrice).toNumber(),
        name: this.params.name || this.params.collection.name,
        collection: {
          name: this.params.collection.name,
          floorPrice: new BigNumber(
            this.params.collection.floorPrice
          ).toNumber(),
        },
      },
      imageUri: this.params.collection.imageUri,
      attributes: this.params.attributes || {},
      link:
        this.params.link ||
        `https://www.tensor.trade/item/${this.params.address}`,
      sourceRefs: this.params.sourceRefs,
      ref: this.params.ref?.toString(),
    };
  }
}
