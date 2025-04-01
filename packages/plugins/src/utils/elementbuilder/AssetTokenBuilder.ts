import {
  NetworkIdType,
  PortfolioAsset,
  PortfolioAssetAttributes,
  SourceRef,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import tokenPriceToAssetToken from '../misc/tokenPriceToAssetToken';
import { TokenPriceMap } from '../../TokenPriceMap';
import tokenPriceToAssetTokens from '../misc/tokenPriceToAssetTokens';
import { AssetBuilder } from './AssetBuilder';
import { PortfolioAssetTokenParams } from './Params';

export class AssetTokenBuilder extends AssetBuilder {
  address: string;
  amount: number | BigNumber | string;
  attributes: PortfolioAssetAttributes;
  alreadyShifted: boolean;
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
  link?: string;

  constructor(params: PortfolioAssetTokenParams) {
    super();
    this.address = params.address.toString();
    this.amount = params.amount;
    this.attributes = params.attributes || {};
    this.alreadyShifted = params.alreadyShifted || false;
    this.ref = params.ref;
    this.sourceRefs = params.sourceRefs;
    this.link = params.link;
  }

  tokenAddresses(): string[] {
    return [this.address];
  }

  getUnderlyings(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap
  ): PortfolioAsset[] {
    const tokenPrice = tokenPrices.get(this.address);
    if (!tokenPrice) return [];

    let amount = new BigNumber(this.amount);

    if (amount.isZero() && tokenPrice.underlyings) return [];

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

    return {
      ...tokenPriceToAssetToken(
        tokenPrice.address,
        amount.toNumber(),
        networkId,
        tokenPrice,
        undefined,
        this.attributes,
        this.link
      ),
      sourceRefs: this.sourceRefs,
      ref: this.ref?.toString(),
    };
  }
}
