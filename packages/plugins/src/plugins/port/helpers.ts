import { uniformFixedSizeArray } from '@metaplex-foundation/beet';
import {
  obligationCollateralStruct,
  obligationLiquidityStruct,
} from './structs';

export function parseApy(apy: string | undefined): number {
  if (!apy) return 0;
  return Number(apy.replace('%', '')) / 100;
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
