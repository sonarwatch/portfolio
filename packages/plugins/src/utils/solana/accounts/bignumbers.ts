import {
  getF32Codec,
  getF64Codec,
  getI64Codec,
  getU128Codec,
  getU64Codec,
  transformCodec,
} from '@solana/kit';
import BigNumber from 'bignumber.js';

export const getU64BigNumberCodec = () =>
  transformCodec(
    getU64Codec(),
    (integerInput: BigNumber): number | bigint =>
      BigInt(integerInput.toString()),
    (integer: bigint): BigNumber => new BigNumber(integer.toString())
  );

export const getU128BigNumberCodec = () =>
  transformCodec(
    getU128Codec(),
    (integerInput: BigNumber): number | bigint =>
      BigInt(integerInput.toString()),
    (integer: bigint): BigNumber => new BigNumber(integer.toString())
  );

export const getF32BigNumberCodec = () =>
  transformCodec(
    getF32Codec(),
    (integerInput: BigNumber): number | bigint =>
      BigInt(integerInput.toString()),
    (integer: number): BigNumber => new BigNumber(integer)
  );

export const getF64BigNumberCodec = () =>
  transformCodec(
    getF64Codec(),
    (integerInput: BigNumber): number | bigint =>
      BigInt(integerInput.toString()),
    (integer: number): BigNumber => new BigNumber(integer)
  );

export const getI64BigNumberCodec = () =>
  transformCodec(
    getI64Codec(),
    (integerInput: BigNumber): number | bigint =>
      BigInt(integerInput.toString()),
    (integer: bigint): BigNumber => new BigNumber(integer.toString())
  );
