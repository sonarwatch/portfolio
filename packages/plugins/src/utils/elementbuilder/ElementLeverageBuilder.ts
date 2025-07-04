import {
  fixUsdValue,
  getUsdValueSum,
  getUsdValueSumStrict,
  NetworkIdType,
  PortfolioAsset,
  PortfolioElementLeverage,
  PortfolioElementType,
  TokenPriceMap,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import {
  CrossLevPositionParams,
  IsoLevPositionParams,
  Params,
  PortfolioAssetTokenParams,
} from './Params';
import {
  CrossLevPositionBuilder,
  IsoLevPositionBuilder,
} from './LevPositionBuilder';
import { AssetTokenBuilder } from './AssetTokenBuilder';
import { TokenYieldMap } from '../../TokenYieldMap';

export class ElementLeverageBuilder extends ElementBuilder {
  isoPositions: IsoLevPositionBuilder[];
  crossPositions: CrossLevPositionBuilder[];
  crossCollateralAssets: AssetTokenBuilder[];

  constructor(params: Params) {
    super(params);
    this.isoPositions = [];
    this.crossPositions = [];
    this.crossCollateralAssets = [];
  }

  override tokenAddresses(): string[] {
    const addresses: string[] = [];
    this.isoPositions.forEach((p) => {
      if (p.tokenAddress) addresses.push(p.tokenAddress);
    });
    this.crossPositions.forEach((p) => {
      if (p.tokenAddress) addresses.push(p.tokenAddress);
    });
    this.crossCollateralAssets.forEach((p) => {
      addresses.push(p.address);
    });
    return addresses;
  }

  addIsoPosition(params: IsoLevPositionParams) {
    const isoPositionBuilder = new IsoLevPositionBuilder(params);
    this.isoPositions.push(isoPositionBuilder);
    return isoPositionBuilder;
  }

  addCrossPosition(params: CrossLevPositionParams) {
    const crossPositionBuilder = new CrossLevPositionBuilder(params);
    this.crossPositions.push(crossPositionBuilder);
    return crossPositionBuilder;
  }

  addCrossCollateral(params: PortfolioAssetTokenParams) {
    this.crossCollateralAssets.push(new AssetTokenBuilder(params));
  }

  get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap,
    tokenYields: TokenYieldMap
  ): PortfolioElementLeverage | null {
    if (
      this.isoPositions.length === 0 &&
      this.crossPositions.length === 0 &&
      this.crossCollateralAssets.length === 0
    )
      return null;

    const isoPositions = this.isoPositions.map((p) => p.get(networkId));
    const isoValue = getUsdValueSum([...isoPositions.map((a) => a.value)]);
    const crossPositions = this.crossPositions.map((p) => p.get(networkId));
    const crossCollateralAssets = this.crossCollateralAssets
      .map((p) => p.get(networkId, tokenPrices, tokenYields))
      .filter((a) => a !== null) as PortfolioAsset[];
    const crossValue = getUsdValueSum([
      ...crossCollateralAssets.map((a) => a.value),
      ...crossPositions.map((p) => p.pnlValue),
    ]);
    const crossSizeValueTotal = getUsdValueSumStrict(
      crossPositions.map((p) => p.sizeValue)
    );
    const crossLeverage =
      crossSizeValueTotal && crossValue
        ? crossSizeValueTotal / crossValue
        : undefined;

    const value = getUsdValueSum([crossValue, isoValue]);

    return {
      type: PortfolioElementType.leverage,
      name: this.name,
      tags: this.tags,
      label: this.label,
      data: {
        isolated: {
          positions: isoPositions,
          value: fixUsdValue(isoValue),
        },
        cross: {
          positions: crossPositions,
          collateralAssets: crossCollateralAssets,
          collateralValue: getUsdValueSum(
            crossCollateralAssets.map((a) => a.value)
          ),
          value: fixUsdValue(crossValue),
          leverage: crossLeverage,
        },
        value,
        ref: this.ref?.toString(),
        sourceRefs: this.sourceRefs,
        link: this.link,
      },
      networkId,
      platformId: this.platformId || platformId,
      value,
      netApy: this.netApy,
    };
  }
}
