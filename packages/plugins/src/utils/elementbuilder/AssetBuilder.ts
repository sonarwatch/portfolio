import {
  NetworkIdType,
  PortfolioAsset,
  PortfolioAssetAttributes,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PortfolioAssetParams } from './PortfolioAssetParams';
import tokenPriceToAssetToken from '../misc/tokenPriceToAssetToken';
import { TokenPriceMap } from '../../TokenPriceMap';
import tokenPriceToAssetTokens from '../misc/tokenPriceToAssetTokens';

export class AssetBuilder {
  address: string;
  amount: number | BigNumber | string;
  attributes: PortfolioAssetAttributes;
  alreadyShifted: boolean;

  constructor(params: PortfolioAssetParams) {
    this.address = params.address.toString();
    this.amount = params.amount;
    this.attributes = params.attributes || {};
    this.alreadyShifted = params.alreadyShifted || false;
  }

  getUnderlyings(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap
  ): PortfolioAsset[] {
    let amount = new BigNumber(this.amount);
    if (amount.isZero()) return [];
    const tokenPrice = tokenPrices.get(this.address);
    if (!tokenPrice) return [];

    if (!this.alreadyShifted)
      amount = amount.dividedBy(10 ** tokenPrice.decimals);

    return tokenPriceToAssetTokens(
      tokenPrice.address,
      amount.toNumber(),
      networkId,
      tokenPrice,
      undefined,
      this.attributes
    );
  }

  get(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap
  ): PortfolioAsset | null {
    let amount = new BigNumber(this.amount);
    if (amount.isZero()) return null;
    const tokenPrice = tokenPrices.get(this.address);
    if (!tokenPrice) return null;

    if (!this.alreadyShifted)
      amount = amount.dividedBy(10 ** tokenPrice.decimals);

    return tokenPriceToAssetToken(
      tokenPrice.address,
      amount.toNumber(),
      networkId,
      tokenPrice,
      undefined,
      this.attributes
    );
  }
}
