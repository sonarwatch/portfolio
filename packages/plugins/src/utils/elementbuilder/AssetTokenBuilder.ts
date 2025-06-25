import {
  NetworkIdType,
  PortfolioAsset,
  PortfolioAssetAttributes,
  SourceRef,
  TokenPriceMap,
  TokenYield,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';
import tokenPriceToAssetToken from '../misc/tokenPriceToAssetToken';
import tokenPriceToAssetTokens from '../misc/tokenPriceToAssetTokens';
import { AssetBuilder } from './AssetBuilder';
import { PortfolioAssetTokenParams } from './Params';
import { TokenYieldMap } from '../../TokenYieldMap';

export class AssetTokenBuilder extends AssetBuilder {
  address: string;
  amount: number | BigNumber | string;
  attributes: PortfolioAssetAttributes;
  alreadyShifted: boolean;
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
  link?: string;
  tokenYield?: TokenYield;

  constructor(params: PortfolioAssetTokenParams) {
    super();
    this.address = params.address.toString();
    this.amount = params.amount;
    this.attributes = params.attributes || {};
    this.alreadyShifted = params.alreadyShifted || false;
    this.ref = params.ref;
    this.sourceRefs = params.sourceRefs;
    this.link = params.link;
    this.tokenYield = params.tokenYield;
  }

  tokenAddresses(): string[] {
    return [this.address];
  }

  getUnderlyings(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tokenYields: TokenYieldMap
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
    tokenPrices: TokenPriceMap,
    tokenYields: TokenYieldMap
  ): PortfolioAsset | null {
    let amount = new BigNumber(this.amount);
    if (amount.isZero()) return null;

    const tokenPrice = tokenPrices.get(this.address);
    if (!tokenPrice && !this.alreadyShifted) return null;

    if (!this.alreadyShifted && tokenPrice)
      amount = amount.dividedBy(10 ** tokenPrice.decimals);

    const tokenYield = this.tokenYield || tokenYields.get(this.address);

    return {
      ...tokenPriceToAssetToken(
        this.address,
        amount.toNumber(),
        networkId,
        tokenPrice,
        undefined,
        this.attributes,
        this.link,
        tokenYield
      ),
      sourceRefs: this.sourceRefs,
      ref: this.ref?.toString(),
    };
  }
}
