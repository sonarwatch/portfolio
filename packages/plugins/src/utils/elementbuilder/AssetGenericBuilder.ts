import {
  NetworkIdType,
  PortfolioAsset,
  PortfolioAssetType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { TokenPriceMap } from '../../TokenPriceMap';
import { PortfolioAssetGenericParams } from './PortfolioAssetGenericParams';
import { AssetBuilder } from './AssetBuilder';

export class AssetGenericBuilder extends AssetBuilder {
  params: PortfolioAssetGenericParams;

  constructor(params: PortfolioAssetGenericParams) {
    super();
    this.params = params;
  }

  // eslint-disable-next-line class-methods-use-this
  mints(): string[] {
    return [];
  }

  get(
    networkId: NetworkIdType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tokenPrices: TokenPriceMap
  ): PortfolioAsset | null {
    let value = new BigNumber(0);
    if (this.params.value) {
      value = new BigNumber(this.params.value);
    } else if (this.params.amount && this.params.price) {
      value = new BigNumber(this.params.amount).multipliedBy(
        this.params.amount
      );
    }

    if (value.isZero()) return null;

    return {
      type: PortfolioAssetType.generic,
      networkId,
      value: value.toNumber(),
      name: this.params.name,
      data: {
        address: this.params.address
          ? this.params.address.toString()
          : undefined,
        amount: this.params.amount
          ? new BigNumber(this.params.amount).toNumber()
          : undefined,
      },
      attributes: this.params.attributes || {},
    };
  }
}
