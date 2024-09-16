import {
  getUsdValueSum,
  NetworkIdType,
  PortfolioAsset,
  PortfolioElementLiquidity,
  PortfolioLiquidity,
  UsdValue,
  Yield,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { TokenPriceMap } from '../../TokenPriceMap';
import tokenPriceToAssetToken from '../misc/tokenPriceToAssetToken';
import { AssetBuilder } from './AssetBuilder';
import { ElementParams } from './ElementParams';
import { PortfolioAssetParams } from './PortfolioAssetParams';

export class LiquidityBuilder {
  assets: AssetBuilder[];
  rewardAssets: AssetBuilder[];
  yields: Yield[];

  constructor() {
    this.assets = [];
    this.rewardAssets = [];
    this.yields = [];
  }

  addAsset(params: PortfolioAssetParams) {
    this.assets.push(new AssetBuilder(params));
  }

  addRewardAsset(params: PortfolioAssetParams) {
    this.rewardAssets.push(new AssetBuilder(params));
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

  export(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap
  ): PortfolioLiquidity | null {
    const assets = this.assets
      .map((a) => a.export(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];
    const rewardAssets = this.rewardAssets
      .map((a) => a.export(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];

    if (assets.length === 0 && rewardAssets.length === 0) return null;

    const assetsValue = getUsdValueSum(assets.map((asset) => asset.value));
    const rewardAssetsValue = getUsdValueSum(
      rewardAssets.map((asset) => asset.value)
    );
    const value = (assetsValue || 0) + (rewardAssetsValue || 0);

    if (value === 0) return null;

    return {
      assets,
      assetsValue,
      rewardAssets,
      rewardAssetsValue,
      value,
      yields: this.yields,
    } as PortfolioLiquidity;
  }
}
