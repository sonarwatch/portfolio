import { UsdValue } from '../UsdValue';

export const fixUsdValue = (value: UsdValue): UsdValue => {
  if (value === null) return value;
  if (value === 0) return value;

  return Number(value.toFixed(9));
};
