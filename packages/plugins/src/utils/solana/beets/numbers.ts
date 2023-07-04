import { FixedSizeBeet, SupportedTypeDefinition } from '@metaplex-foundation/beet';
import BigNumber from 'bignumber.js';
import { BN } from 'bn.js';
import { BEET_SONARWATCH_PACKAGE } from './helpers';

function unsignedLargeBeet(byteSize: number, description: string) {
  return {
    write: function (buf: Buffer, offset: number, value: BigNumber) {
      const bn = new BN(value.toString());
      const bytesArray = bn.toArray('le', this.byteSize);
      const bytesArrayBuf = Buffer.from(bytesArray);
      bytesArrayBuf.copy(buf, offset, 0, this.byteSize);
    },
    read: function (buf: Buffer, offset: number): BigNumber {
      const subarray = buf.subarray(offset, offset + this.byteSize);
      return new BigNumber(new BN(subarray, 'le').toString());
    },
    byteSize,
    description,
  };
}

export const u64: FixedSizeBeet<BigNumber> = unsignedLargeBeet(8, 'u64');
export const u128: FixedSizeBeet<BigNumber> = unsignedLargeBeet(16, 'u128');
export const u256: FixedSizeBeet<BigNumber> = unsignedLargeBeet(32, 'u256');
export const u512: FixedSizeBeet<BigNumber> = unsignedLargeBeet(64, 'u512');

function signedLargeBeet(byteSize: number, description: string) {
  const bitSize = byteSize * 8;
  return {
    write: function (buf: Buffer, offset: number, value: BigNumber) {
      const bn = new BN(value.toString()).toTwos(bitSize);
      const bytesArray = bn.toArray('le', this.byteSize);
      const bytesArrayBuf = Buffer.from(bytesArray);
      bytesArrayBuf.copy(buf, offset, 0, this.byteSize);
    },
    read: function (buf: Buffer, offset: number): BigNumber {
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

export type NumbersExports = keyof typeof import('./numbers');
export type NumbersTypeMapKey =
  | 'u64'
  | 'u128'
  | 'u256'
  | 'u512'
  | 'i64'
  | 'i128'
  | 'i256'
  | 'i512';

export type NumbersTypeMap = Record<
  NumbersTypeMapKey,
  SupportedTypeDefinition & { beet: NumbersExports }
>;

// prettier-ignore
export const numbersTypeMap: NumbersTypeMap = {
  // Big Number, they use, the 'BigNumber' type which is defined in this package
  u64  : { beet: 'u64',  isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  u128 : { beet: 'u128', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  u256 : { beet: 'u256', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  u512 : { beet: 'u512', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  i64  : { beet: 'i64',  isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  i128 : { beet: 'i128', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  i256 : { beet: 'i256', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
  i512 : { beet: 'i512', isFixable: false, sourcePack: BEET_SONARWATCH_PACKAGE, ts: 'BigNumber', pack: BEET_SONARWATCH_PACKAGE  },
}
