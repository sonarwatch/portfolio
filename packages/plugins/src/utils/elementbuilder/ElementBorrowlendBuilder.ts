import {
  getElementLendingValues,
  NetworkIdType,
  PortfolioAsset,
  PortfolioElement,
  Yield,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { ElementParams } from './ElementParams';
import { TokenPriceMap } from '../../TokenPriceMap';
import { AssetBuilder } from './AssetBuilder';
import { AssetTokenBuilder } from './AssetTokenBuilder';
import { PortfolioAssetTokenParams } from './PortfolioAssetTokenParams';
import { PortfolioAssetGenericParams } from './PortfolioAssetGenericParams';
import { AssetGenericBuilder } from './AssetGenericBuilder';

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

  addBorrowedAsset(params: PortfolioAssetTokenParams) {
    this.borrowedAssets.push(new AssetTokenBuilder(params));
  }

  addBorrowedGenericAsset(params: PortfolioAssetGenericParams) {
    this.borrowedAssets.push(new AssetGenericBuilder(params));
  }

  addSuppliedAsset(params: PortfolioAssetTokenParams) {
    this.suppliedAssets.push(new AssetTokenBuilder(params));
  }

  addSuppliedGenericAsset(params: PortfolioAssetGenericParams) {
    this.suppliedAssets.push(new AssetGenericBuilder(params));
  }

  addRewardAsset(params: PortfolioAssetTokenParams) {
    this.rewardAssets.push(new AssetTokenBuilder(params));
  }

  addRewardGenericAsset(params: PortfolioAssetGenericParams) {
    this.rewardAssets.push(new AssetGenericBuilder(params));
  }

  addUnsettledAsset(params: PortfolioAssetTokenParams) {
    this.unsettledAssets.push(new AssetTokenBuilder(params));
  }

  addUnsettledGenericAsset(params: PortfolioAssetGenericParams) {
    this.unsettledAssets.push(new AssetGenericBuilder(params));
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
      ...this.borrowedAssets.map((a) => a.mints()),
      ...this.suppliedAssets.map((a) => a.mints()),
      ...this.rewardAssets.map((a) => a.mints()),
      ...this.unsettledAssets.map((a) => a.mints()),
    ].flat();
  }

  get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElement | null {
    const suppliedAssets = this.suppliedAssets
      .map((a) => a.get(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];
    const borrowedAssets = this.borrowedAssets
      .map((a) => a.get(networkId, tokenPrices))
      .filter(
        (a) => a !== null && a.value && a.value > 0.002
      ) as PortfolioAsset[];
    const rewardAssets = this.rewardAssets
      .map((a) => a.get(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];
    const unsettledAssets = this.unsettledAssets
      .map((a) => a.get(networkId, tokenPrices))
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
      platformId: this.platformId || platformId,
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
