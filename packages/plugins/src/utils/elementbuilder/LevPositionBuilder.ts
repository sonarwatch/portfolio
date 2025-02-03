import {
  formatTokenAddress,
  LevPosition,
  NetworkIdType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { TokenPriceMap } from '../../TokenPriceMap';
import { LevPositionParams } from './Params';

export class LevPositionBuilder {
  private params: LevPositionParams;

  constructor(params: LevPositionParams) {
    this.params = params;
  }

  mints(): string[] {
    if (this.params.collateralAmount) return [this.params.address];
    return [];
  }

  get(
    networkId: NetworkIdType,
    tokenPrices: TokenPriceMap
  ): LevPosition | null {
    let collateralValue;
    if (this.params.collateralAmount) {
      const collateralTokenPrice = tokenPrices.get(this.params.address);
      if (!collateralTokenPrice) return null;
      collateralValue = this.params.collateralAmount
        .dividedBy(10 ** collateralTokenPrice.decimals)
        .multipliedBy(collateralTokenPrice.price);
    } else if (!this.params.collateralValue) {
      return null;
    } else {
      collateralValue = new BigNumber(this.params.collateralValue);
    }

    return {
      address: formatTokenAddress(this.params.address, networkId),
      side: this.params.side,
      liquidationPrice: this.params.liquidationPrice || null,
      collateralValue: collateralValue.toNumber(),
      sizeValue: this.params.sizeValue.toNumber(),
      pnlValue: this.params.pnlValue?.toNumber(),
      value: collateralValue.plus(this.params.pnlValue || 0).toNumber(),
      name: this.params.name,
      imageUri: this.params.imageUri,
      leverage: this.params.leverage,
    } as LevPosition;
  }
}
