import BigNumber from 'bignumber.js';
import { SupplyPool } from './types';
import { ObjectResponse } from '../../utils/sui/types';

export const calcDebtByShares = (
  lendFacilCap: string,
  supplyPool: ObjectResponse<SupplyPool>,
  debtShares: number
) => {
  const lendFacilInfo =
    supplyPool.data?.content?.fields.debt_info.fields.contents.find(
      (di) => di.fields.key === lendFacilCap
    );
  if (!lendFacilInfo) return 0;
  const debtRegistry = lendFacilInfo.fields.value.fields.debt_registry;
  if (!debtRegistry || debtRegistry.fields.supply_x64 === '0') return 0;

  const updatedLiabilityX64 = BigInt(
    lendFacilInfo.fields.value.fields.debt_registry.fields.liability_value_x64
  );

  return new BigNumber(updatedLiabilityX64.toString())
    .multipliedBy(debtShares.toString())
    .div(debtRegistry.fields.supply_x64)
    .dividedBy(2 ** 64);
};

export const calcEquityValues = (
  debtX: BigNumber,
  debtY: BigNumber,
  s: BigNumber,
  a: BigNumber,
  poolPrice: BigNumber
): {
  x: BigNumber;
  y: BigNumber;
} => {
  if (s.lt(debtX) && a.lt(debtY))
    return {
      x: new BigNumber(0),
      y: new BigNumber(0),
    };
  if (s.gte(debtX) && a.gte(debtY))
    return {
      x: s.minus(debtX),
      y: a.minus(debtY),
    };
  if (a.lt(debtY)) {
    const l = debtY.minus(a).div(poolPrice);
    return {
      x: s.minus(debtX).minus(l),
      y: new BigNumber(0),
    };
  }
  const l = debtX.minus(s).multipliedBy(poolPrice);
  const d = a.minus(debtY).minus(l);
  return {
    x: new BigNumber(0),
    y: d,
  };
};
