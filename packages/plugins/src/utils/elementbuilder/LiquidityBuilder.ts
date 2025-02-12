import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioAsset,
  PortfolioLiquidity,
  Yield,
} from '@sonarwatch/portfolio-core';
import { TokenPriceMap } from '../../TokenPriceMap';
import { AssetTokenBuilder } from './AssetTokenBuilder';
import { LiquidityParams, PortfolioAssetTokenParams } from './Params';

export class LiquidityBuilder {
  private readonly params?: LiquidityParams;
  assets: AssetTokenBuilder[];
  rewardAssets: AssetTokenBuilder[];
  yields: Yield[];

  constructor(params?: LiquidityParams) {
    this.assets = [];
    this.rewardAssets = [];
    this.yields = [];
    this.params = params;
  }

  addAsset(params: PortfolioAssetTokenParams) {
    this.assets.push(new AssetTokenBuilder(params));
  }

  addRewardAsset(params: PortfolioAssetTokenParams) {
    this.rewardAssets.push(new AssetTokenBuilder(params));
  }

  addYield(ayield: Yield) {
    this.yields.push(ayield);
  }

  mints(): string[] {
    return [
      ...this.assets.map((a) => a.address),
      ...this.rewardAssets.map((a) => a.address),
    ];
  }

  get(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap
  ): PortfolioLiquidity | null {
    const assets = this.assets
      .map((a) => a.getUnderlyings(networkId, tokenPrices))
      .flat()
      .filter((a) => a !== null) as PortfolioAsset[];
    const rewardAssets = this.rewardAssets
      .map((a) => a.get(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];

    if (assets.length === 0 && rewardAssets.length === 0) return null;

    const assetsValue = getUsdValueSum(assets.map((asset) => asset.value));
    const rewardAssetsValue = getUsdValueSum(
      rewardAssets.map((asset) => asset.value)
    );
    const value = (assetsValue || 0) + (rewardAssetsValue || 0);

    if (value <= 0) return null;

    return {
      assets,
      assetsValue,
      rewardAssets,
      rewardAssetsValue,
      value,
      yields: this.yields,
      name: this.params ? this.params.name : undefined,
      ref: this.params ? this.params.ref?.toString() : undefined,
      sourceRefs: this.params ? this.params.sourceRefs : undefined,
      link: this.params ? this.params.link : undefined,
    } as PortfolioLiquidity;
  }
}
