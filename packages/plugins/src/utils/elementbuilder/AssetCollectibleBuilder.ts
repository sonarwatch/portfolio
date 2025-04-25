import {
  NetworkIdType,
  PortfolioAssetCollectible,
  PortfolioAssetType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { TokenPriceMap } from '../../TokenPriceMap';
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
    return {
      type: PortfolioAssetType.collectible,
      networkId,
      value: new BigNumber(this.params.collection.floorPrice)
        .multipliedBy(new BigNumber(this.params.amount || 1))
        .toNumber(),
      name: this.params.name || this.params.collection.name,
      data: {
        address: this.params.address.toString(),
        amount: new BigNumber(this.params.amount || 1).toNumber(),
        price: new BigNumber(this.params.collection.floorPrice).toNumber(),
        name: this.params.name || this.params.collection.name,
        /* dataUri: asset.content.json_uri,
        attributes: asset.content.metadata.attributes, */
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
