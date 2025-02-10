import {
  getUsdValueSum,
  LevPosition,
  NetworkIdType,
  PortfolioElementLeverage,
} from '@sonarwatch/portfolio-core';
import { ElementBuilder } from './ElementBuilder';
import { LevPositionParams, Params } from './Params';
import { TokenPriceMap } from '../../TokenPriceMap';
import { LevPositionBuilder } from './LevPositionBuilder';

export class ElementLeverageBuilder extends ElementBuilder {
  positions: LevPositionBuilder[];

  constructor(params: Params) {
    super(params);
    this.positions = [];
  }

  addPosition(params: LevPositionParams) {
    const levPositionBuilder = new LevPositionBuilder(params);
    this.positions.push(levPositionBuilder);
    return levPositionBuilder;
  }

  tokenAddresses(): string[] {
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
    return {
      type: this.type,
      label: this.label,
      data: {
        positions,
        value,
        ref: this.ref?.toString(),
        sourceRefs: this.sourceRefs,
        link: this.link,
      },
      networkId,
      platformId: this.platformId || platformId,
      value,
    } as PortfolioElementLeverage;
  }
}
