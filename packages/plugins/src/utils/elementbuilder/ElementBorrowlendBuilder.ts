import {
  getElementLendingValues,
  NetworkIdType,
  PortfolioAsset,
  PortfolioElement,
  Yield,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { AssetBuilder } from './AssetBuilder';
import { ElementParams } from './ElementParams';
import { PortfolioAssetParams } from './PortfolioAssetParams';
import { TokenPriceMap } from '../../TokenPriceMap';

export class ElementBorrowlendBuilder extends ElementBuilder {
  borrowedAssets: AssetBuilder[];
  suppliedAssets: AssetBuilder[];
  rewardAssets: AssetBuilder[];
  unsettledAssets: AssetBuilder[];
  borrowedYields: Yield[][];
  suppliedYields: Yield[][];
  suppliedLtvs: number[];
  borrowedWeights: number[];

  constructor(params: ElementParams) {
    super(params);
    this.borrowedAssets = [];
    this.suppliedAssets = [];
    this.rewardAssets = [];
    this.unsettledAssets = [];
    this.borrowedYields = [];
    this.suppliedYields = [];
    this.suppliedLtvs = [];
    this.borrowedWeights = [];
  }

  addBorrowedAsset(params: PortfolioAssetParams) {
    this.borrowedAssets.push(new AssetBuilder(params));
  }

  addSuppliedAsset(params: PortfolioAssetParams) {
    this.suppliedAssets.push(new AssetBuilder(params));
  }

  addRewardAsset(params: PortfolioAssetParams) {
    this.rewardAssets.push(new AssetBuilder(params));
  }

  addUnsettledAssets(params: PortfolioAssetParams) {
    this.unsettledAssets.push(new AssetBuilder(params));
  }

  addBorrowedYield(ayield: Yield[]) {
    this.borrowedYields.push(ayield);
  }

  addSuppliedYield(ayield: Yield[]) {
    this.suppliedYields.push(ayield);
  }

  addSuppliedLtv(ltv: number) {
    this.suppliedLtvs.push(ltv);
  }

  addBorrowedWeight(borrowedWeight: number) {
    this.borrowedWeights.push(borrowedWeight);
  }

  mints(): string[] {
    return [
      ...this.borrowedAssets,
      ...this.suppliedAssets,
      ...this.rewardAssets,
    ].map((a) => a.address);
  }

  dump(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElement | null {
    const suppliedAssets = this.suppliedAssets
      .map((a) => a.dump(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];
    const borrowedAssets = this.borrowedAssets
      .map((a) => a.dump(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];
    const rewardAssets = this.rewardAssets
      .map((a) => a.dump(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];
    const unsettledAssets = this.unsettledAssets
      .map((a) => a.dump(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];

    if (
      suppliedAssets.length === 0 &&
      borrowedAssets.length === 0 &&
      rewardAssets.length === 0
    )
      return null;

    const {
      borrowedValue,
      suppliedValue,
      rewardValue,
      healthRatio,
      unsettledValue,
      value,
    } = getElementLendingValues({
      suppliedAssets,
      borrowedAssets,
      rewardAssets,
      suppliedLtvs:
        this.suppliedLtvs.length === suppliedAssets.length
          ? this.suppliedLtvs
          : undefined,
      borrowedWeights:
        this.borrowedWeights.length === borrowedAssets.length
          ? this.borrowedWeights
          : undefined,
      unsettledAssets,
    });

    if (!suppliedValue && !borrowedValue && !rewardValue) return null;

    const element = {
      type: this.type,
      label: this.label,
      networkId,
      platformId,
      data: {
        borrowedAssets,
        borrowedValue,
        borrowedYields: this.borrowedYields,
        suppliedAssets,
        suppliedValue,
        suppliedYields: this.suppliedYields,
        rewardAssets,
        rewardValue,
        healthRatio,
        unsettled: {
          assets: unsettledAssets,
          value: unsettledValue,
        },
        value,
      },
      value,
      name: this.name,
      tags: this.tags,
    };

    return element as PortfolioElement;
  }
}
