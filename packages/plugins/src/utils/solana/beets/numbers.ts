import { publicKey } from '@metaplex-foundation/beet-solana';
import {
  FixedSizeBeet,
  SupportedTypeDefinition,
} from '@metaplex-foundation/beet';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { BN } from 'bn.js';
import Decimal from 'decimal.js';
import { BEET_SONARWATCH_PACKAGE } from './helpers';

function unsignedLargeBeet(byteSize: number, description: string) {
  return {
    write(buf: Buffer, offset: number, value: BigNumber) {
      const bn = new BN(value.toString());
      const bytesArray = bn.toArray('le', this.byteSize);
      const bytesArrayBuf = Buffer.from(bytesArray);
      bytesArrayBuf.copy(buf, offset, 0, this.byteSize);
    },
    read(buf: Buffer, offset: number): BigNumber {
      const subarray = buf.subarray(offset, offset + this.byteSize);
      return new BigNumber(new BN(subarray, 'le').toString());
    },
    byteSize,
    description,
  };
}

function unsignedLargeBeetStr(byteSize: number, description: string) {
  return {
    write(buf: Buffer, offset: number, value: string) {
      const bn = new BN(value);
      const bytesArray = bn.toArray('le', this.byteSize);
      const bytesArrayBuf = Buffer.from(bytesArray);
      bytesArrayBuf.copy(buf, offset, 0, this.byteSize);
    },
    read(buf: Buffer, offset: number): string {
      const subarray = buf.subarray(offset, offset + this.byteSize);
      return new BN(subarray, 'le').toString();
    },
    byteSize,
    description,
  };
}

function unsignedSplittedFloatLargeBeet(
  integerSize: number,
  floatSize: number,
  description: string
) {
  const byteSize = integerSize + floatSize;
  const bitSize = byteSize * 8;
  return {
    write(buf: Buffer, offset: number, value: BigNumber) {
      const bn = new BN(value.toString()).toTwos(bitSize);
      const bytesArray = bn.toArray('le', byteSize);
      const bytesArrayBuf = Buffer.from(bytesArray);
      bytesArrayBuf.copy(buf, offset, 0, byteSize);
    },
    read(buf: Buffer, offset: number): BigNumber {
      const subarray = buf.subarray(offset, offset + byteSize);
      const x = new BN(subarray, 'le');
      const value = new BigNumber(x.fromTwos(bitSize).toString());
      if (!value) return new BigNumber(0);

      const numbers = new Decimal(
        `${value.isNegative() ? '-' : ''}0b${value.abs().toString(2)}p-${
          floatSize * 8
        }`
      ).dividedBy(10 ** 0);
      return new BigNumber(numbers.toString());
    },
    byteSize,
    description,
  };
}

export const f32: FixedSizeBeet<BigNumber> = unsignedSplittedFloatLargeBeet(
  2,
  2,
  'f32'
);
export const f64: FixedSizeBeet<BigNumber> = unsignedSplittedFloatLargeBeet(
  4,
  4,
  'f64'
);

export const fp64: FixedSizeBeet<BigNumber> = {
  write(buf: Buffer, offset: number, value: BigNumber) {
    buf.writeDoubleLE(value.toNumber(), offset);
  },
  read(buf: Buffer, offset: number): BigNumber {
    const subarray = buf.subarray(offset, offset + 8);
    return new BigNumber(subarray.readDoubleLE());
  },
  byteSize: 8,
  description: 'fp64',
};

export const u64: FixedSizeBeet<BigNumber> = unsignedLargeBeet(8, 'u64');
export const u128: FixedSizeBeet<BigNumber> = unsignedLargeBeet(16, 'u128');
export const u256: FixedSizeBeet<BigNumber> = unsignedLargeBeet(32, 'u256');
export const u512: FixedSizeBeet<BigNumber> = unsignedLargeBeet(64, 'u512');

export const u64Str: FixedSizeBeet<string> = unsignedLargeBeetStr(8, 'u64');
export const u128Str: FixedSizeBeet<string> = unsignedLargeBeetStr(16, 'u128');
export const u256Str: FixedSizeBeet<string> = unsignedLargeBeetStr(32, 'u256');
export const u512Str: FixedSizeBeet<string> = unsignedLargeBeetStr(64, 'u512');

export const publicKeyStr = {
  write(buf: Buffer, offset: number, value: string) {
    publicKey.write(buf, offset, new PublicKey(value));
  },
  read(buf: Buffer, offset: number): string {
    return publicKey.read(buf, offset).toString();
  },
  byteSize: publicKey.byteSize,
  description: publicKey.description,
};

function signedLargeBeet(byteSize: number, description: string) {
  const bitSize = byteSize * 8;
  return {
    write(buf: Buffer, offset: number, value: BigNumber) {
      const bn = new BN(value.toString()).toTwos(bitSize);
      const bytesArray = bn.toArray('le', this.byteSize);
      const bytesArrayBuf = Buffer.from(bytesArray);
      bytesArrayBuf.copy(buf, offset, 0, this.byteSize);
    },
    read(buf: Buffer, offset: number): BigNumber {
      const subarray = buf.subarray(offset, offset + this.byteSize);
      const x = new BN(subarray, 'le');
      return new BigNumber(x.fromTwos(bitSize).toString());
    },
    byteSize,
    description,
  };
}

export const i64: FixedSizeBeet<BigNumber> = signedLargeBeet(8, 'i64');
export const i128: FixedSizeBeet<BigNumber> = signedLargeBeet(16, 'i128');
export const i256: FixedSizeBeet<BigNumber> = signedLargeBeet(32, 'i256');
export const i512: FixedSizeBeet<BigNumber> = signedLargeBeet(64, 'i512');

export const i80f48: FixedSizeBeet<BigNumber> = unsignedSplittedFloatLargeBeet(
  10,
  6,
  'i80f48'
);

export type NumbersExports = keyof typeof import('./numbers');
export type NumbersTypeMapKey =
  | 'f32'
  | 'f64'
  | 'u64'
  | 'u128'
  | 'u256'
  | 'u512'
  | 'i64'
  | 'i128'
  | 'i256'
  | 'i512'
  | 'i80f48';

export type NumbersTypeMap = Record<
  NumbersTypeMapKey,
  SupportedTypeDefinition & { beet: NumbersExports }
>;

// prettier-ignore
export const numbersTypeMap: NumbersTypeMap = {
  // Big Number, they use, the 'BigNumber' type which is defined in this package
  f32  : { beet: 'f32',  isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  f64  : { beet: 'f64',  isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  u64  : { beet: 'u64',  isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  u128 : { beet: 'u128', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  u256 : { beet: 'u256', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  u512 : { beet: 'u512', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  i64  : { beet: 'i64',  isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  i128 : { beet: 'i128', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  i256 : { beet: 'i256', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  i512 : { beet: 'i512', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  i80f48 : { beet: 'i80f48', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
}
