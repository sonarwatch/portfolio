import {
  CrossLevPosition,
  IsoLevPosition,
  UsdValue,
} from '@sonarwatch/portfolio-core';

export type IsoLevPositionParams = Omit<IsoLevPosition, 'value'> & {
  value?: UsdValue;
};

export type CrossLevPositionParams = CrossLevPosition;
