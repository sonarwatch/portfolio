import { LeverageSide, UsdValue } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

export type LevPositionParams = {
  address: string;
  collateralAmount?: BigNumber;
  collateralValue?: UsdValue; // collateralAmount or collateralValue is required
  side: LeverageSide;
  sizeValue: BigNumber;
  liquidationPrice?: BigNumber;
  pnlValue?: BigNumber;
  name?: string;
  imageUri?: string;
  leverage?: number;
};
