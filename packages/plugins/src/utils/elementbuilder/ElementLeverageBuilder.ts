import {
  getUsdValueSum,
  LevPosition,
  NetworkIdType,
  PortfolioElementLeverage,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { ElementParams } from './ElementParams';
import { TokenPriceMap } from '../../TokenPriceMap';
import { LevPositionBuilder } from './LevPositionBuilder';
import { LevPositionParams } from './LevPositionParams';

export class ElementLeverageBuilder extends ElementBuilder {
  positions: LevPositionBuilder[];

  constructor(params: ElementParams) {
    super(params);
    this.positions = [];
  }

  addPosition(params: LevPositionParams) {
    const levPositionBuilder = new LevPositionBuilder(params);
    this.positions.push(levPositionBuilder);
    return levPositionBuilder;
  }

  mints(): string[] {
    return this.positions.map((position) => position.mints()).flat();
  }

  get(
    networkId: NetworkIdType,
    platformId: string,
    tokenPrices: TokenPriceMap
  ): PortfolioElementLeverage | null {
    const positions = this.positions
      .map((p) => p.get(networkId, tokenPrices))
      .filter((p) => p !== null) as LevPosition[];
    const value = getUsdValueSum(positions.map((a) => a.value));
    const element = {
      type: this.type,
      label: this.label,
      data: {
        positions,
        value,
      },
      networkId,
      platformId: this.platformId || platformId,
      value,
    };

    return element as PortfolioElementLeverage;
  }
}
