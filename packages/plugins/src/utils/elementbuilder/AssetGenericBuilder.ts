import {
  NetworkIdType,
  PortfolioAssetGeneric,
  PortfolioAssetType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { TokenPriceMap } from '../../TokenPriceMap';
import { AssetBuilder } from './AssetBuilder';
import { PortfolioAssetGenericParams } from './Params';

export class AssetGenericBuilder extends AssetBuilder {
  params: PortfolioAssetGenericParams;

  constructor(params: PortfolioAssetGenericParams) {
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
  ): PortfolioAssetGeneric | null {
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
      link: this.params.link,
      sourceRefs: this.params.sourceRefs,
      ref: this.params.ref?.toString(),
    };
  }
}
