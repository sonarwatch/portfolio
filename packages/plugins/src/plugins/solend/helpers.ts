import { uniformFixedSizeArray } from '@metaplex-foundation/beet';
import {
  obligationCollateralStruct,
  obligationLiquidityStruct,
} from './structs';

export const upperFirst = (string: string) =>
  string ? string.charAt(0).toUpperCase() + string.slice(1) : '';

export function getObligationSeed(marketAddress: string, accountId: number) {
  if (accountId === 0) return marketAddress.slice(0, 32);
  // <first 25 char of lending market address> + <7 chars: 0000001 - 9999999>
  return marketAddress.slice(0, 25) + `0000000${accountId}`.slice(-7);
}

export const parseDataflat = (
  dataFlat: Buffer,
  depositsLen: number,
  borrowsLen: number
) => {
  const obligationCollateralArray = uniformFixedSizeArray(
    obligationCollateralStruct,
    depositsLen
  );
  const deposits = obligationCollateralArray.read(dataFlat, 0);
  const depositsMap = new Map(
    deposits.map((i) => [i.depositReserve.toString(), i])
  );

  const obligationLiquidityArray = uniformFixedSizeArray(
    obligationLiquidityStruct,
    borrowsLen
  );
  const borrows = obligationLiquidityArray.read(
    dataFlat,
    obligationCollateralArray.byteSize
  );
  const borrowsMap = new Map(
    borrows.map((i) => [i.borrowReserve.toString(), i])
  );
  return {
    deposits,
    depositsMap,
    borrows,
    borrowsMap,
  };
};
