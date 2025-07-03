import {
  NetworkIdType,
  PortfolioAsset,
  PortfolioAssetAttributes,
  TokenPriceMap,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import tokenPriceToAssetToken from '../misc/tokenPriceToAssetToken';
import { AssetBuilder } from './AssetBuilder';
import { PortfolioAssetPricedTokenParams } from './Params';
import { TokenYieldMap } from '../../TokenYieldMap';

export class AssetPricedTokenBuilder extends AssetBuilder {
  address: string;
  amount: number | BigNumber | string;
  attributes: PortfolioAssetAttributes;
  alreadyShifted: boolean;
  ref?: string | PublicKey;
  price: number | BigNumber;

  constructor(params: PortfolioAssetPricedTokenParams) {
    super();
    this.address = params.address.toString();
    this.amount = params.amount;
    this.attributes = params.attributes || {};
    this.alreadyShifted = true;
    this.ref = params.ref;
    this.price = params.price;
  }

  // eslint-disable-next-line class-methods-use-this
  tokenAddresses(): string[] {
    return [];
  }

  get(
    networkId: NetworkIdType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tokenPrices: TokenPriceMap,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tokenYields: TokenYieldMap
  ): PortfolioAsset | null {
    const amount = new BigNumber(this.amount);
    if (amount.isZero()) return null;

    return {
      ...tokenPriceToAssetToken(
        this.address,
        amount.toNumber(),
        networkId,
        null,
        new BigNumber(this.price).toNumber(),
        this.attributes
      ),
      ref: this.ref?.toString(),
    };
  }
}
