/* eslint-disable max-classes-per-file */
import {
  CrossLevPosition,
  formatTokenAddress,
  getUsdValueSum,
  IsoLevPosition,
  NetworkIdType,
} from '@sonarwatch/portfolio-core';
import { CrossLevPositionParams, IsoLevPositionParams } from './Params';

export class IsoLevPositionBuilder {
  private params: IsoLevPositionParams;

  constructor(params: IsoLevPositionParams) {
    this.params = params;
  }

  get(networkId: NetworkIdType): IsoLevPosition {
    return {
      ...this.params,
      address: this.params.address
        ? formatTokenAddress(this.params.address, networkId)
        : undefined,
      value:
        this.params.value ||
        getUsdValueSum([this.params.collateralValue, this.params.pnlValue]),
    };
  }

  get tokenAddress(): string | undefined {
    return this.params.address;
  }
}

export class CrossLevPositionBuilder {
  private params: CrossLevPositionParams;

  constructor(params: CrossLevPositionParams) {
    this.params = params;
  }

  get(networkId: NetworkIdType): CrossLevPosition {
    return {
      ...this.params,
      address: this.params.address
        ? formatTokenAddress(this.params.address, networkId)
        : undefined,
    };
  }

  get tokenAddress(): string | undefined {
    return this.params.address;
  }
}
