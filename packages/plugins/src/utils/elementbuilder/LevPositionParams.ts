import { LeverageSide, SourceRef, UsdValue } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PublicKey } from '@solana/web3.js';

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
  sourceRefs?: SourceRef[];
  ref?: string | PublicKey;
  link?: string;
};
