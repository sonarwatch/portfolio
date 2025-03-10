import {
  getElementLendingValues,
  NetworkIdType,
  PortfolioAsset,
  PortfolioAssetGeneric,
  PortfolioElementBorrowLend,
  PortfolioElementType,
  UsdValue,
  Yield,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { ElementBuilder } from './ElementBuilder';
import {
  Params,
  PortfolioAssetCollectibleParams,
  PortfolioAssetGenericParams,
  PortfolioAssetTokenParams,
} from './Params';
import { TokenPriceMap } from '../../TokenPriceMap';
import { AssetBuilder } from './AssetBuilder';
import { AssetTokenBuilder } from './AssetTokenBuilder';
import { AssetGenericBuilder } from './AssetGenericBuilder';
import { AssetCollectibleBuilder } from './AssetCollectibleBuilder';

export class ElementBorrowlendBuilder extends ElementBuilder {
  borrowedAssets: AssetBuilder[];
  suppliedAssets: AssetBuilder[];
  rewardAssets: AssetBuilder[];
  unsettledAssets: AssetGenericBuilder[];
  borrowedYields: Yield[][];
  suppliedYields: Yield[][];
  suppliedLtvs: number[];
  borrowedWeights: number[];
  fixedTerms?: {
    expireOn?: number;
    isLender: boolean;
  };

  constructor(params: Params) {
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

  addBorrowedCollectibleAsset(params: PortfolioAssetCollectibleParams) {
    this.borrowedAssets.push(new AssetCollectibleBuilder(params));
  }

  addSuppliedAsset(params: PortfolioAssetTokenParams) {
    this.suppliedAssets.push(new AssetTokenBuilder(params));
  }

  addSuppliedGenericAsset(params: PortfolioAssetGenericParams) {
    this.suppliedAssets.push(new AssetGenericBuilder(params));
  }

  addSuppliedCollectibleAsset(params: PortfolioAssetCollectibleParams) {
    this.suppliedAssets.push(new AssetCollectibleBuilder(params));
  }

  addRewardAsset(params: PortfolioAssetTokenParams) {
    this.rewardAssets.push(new AssetTokenBuilder(params));
  }

  addRewardGenericAsset(params: PortfolioAssetGenericParams) {
    this.rewardAssets.push(new AssetGenericBuilder(params));
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

  setFixedTerms(isLender: boolean, expireOn?: number | BigNumber) {
    this.fixedTerms = {
      expireOn: expireOn ? new BigNumber(expireOn).toNumber() : undefined,
      isLender,
    };
  }

  tokenAddresses(): string[] {
    return [
      ...this.borrowedAssets.map((a) => a.tokenAddresses()),
      ...this.suppliedAssets.map((a) => a.tokenAddresses()),
      ...this.rewardAssets.map((a) => a.tokenAddresses()),
      ...this.unsettledAssets.map((a) => a.tokenAddresses()),
    ].flat();
  }

  get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElementBorrowLend | null {
    const suppliedAssets = this.suppliedAssets
      .map((sAB, i) => {
        const sA = sAB.get(networkId, tokenPrices);
        if (sA === null) {
          this.suppliedYields.splice(i, 1);
          this.suppliedLtvs.splice(i, 1);
        }
        return sA;
      })
      .filter((a) => a !== null) as PortfolioAsset[];

    const borrowedAssets = this.borrowedAssets
      .map((bAB, i) => {
        const bA = bAB.get(networkId, tokenPrices);
        if (bA === null) {
          this.borrowedYields.splice(i, 1);
          this.borrowedWeights.splice(i, 1);
        }
        return bA;
      })
      .filter(
        (a) => a !== null && a.value && a.value > 0.002
      ) as PortfolioAsset[];

    const rewardAssets = this.rewardAssets
      .map((a) => a.get(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAsset[];
    const unsettledAssets = this.unsettledAssets
      .map((a) => a.get(networkId, tokenPrices))
      .filter((a) => a !== null) as PortfolioAssetGeneric[];

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

    let fixedTermsValue: UsdValue = 0;
    if (this.fixedTerms) {
      // Total value
      if (borrowedValue === null || borrowedValue === 0) {
        // it's an offer
        fixedTermsValue = suppliedValue;
      } else if (suppliedValue !== null && suppliedValue !== 0) {
        if (this.fixedTerms.isLender) {
          // supplied sol, nft as collat
          fixedTermsValue = Math.min(suppliedValue, borrowedValue);
        } else {
          // supplied nft as collat, borrow sol
          fixedTermsValue = Math.max(suppliedValue - borrowedValue, 0);
        }
      }
      if (rewardValue !== null && value !== null)
        fixedTermsValue = (fixedTermsValue || 0) + rewardValue;
    }

    if (!suppliedValue && !borrowedValue && !rewardValue) return null;

    return {
      type: PortfolioElementType.borrowlend,
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
        value: this.fixedTerms ? fixedTermsValue : value,
        ref: this.ref?.toString(),
        sourceRefs: this.sourceRefs,
        link: this.link,
        expireOn: this.fixedTerms?.expireOn,
      },
      value: this.fixedTerms ? fixedTermsValue : value,
      name: this.name,
      tags: this.tags,
    };
  }
}
