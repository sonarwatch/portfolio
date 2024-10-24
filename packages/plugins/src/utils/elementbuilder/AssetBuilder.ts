import {
  NetworkIdType,
  PortfolioAsset,
  PortfolioAssetAttributes,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PortfolioAssetParams } from './PortfolioAssetParams';
import tokenPriceToAssetToken from '../misc/tokenPriceToAssetToken';
import { TokenPriceMap } from '../../TokenPriceMap';

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

  get(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap,
    keepIfZero?: boolean
  ): PortfolioAsset | null {
    let amount = new BigNumber(this.amount);
    if (!keepIfZero && amount.isZero()) return null;
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
