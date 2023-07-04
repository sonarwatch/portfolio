import { SupportedTypeDefinition } from '@metaplex-foundation/beet';
import { BEET_SONARWATCH_PACKAGE } from './helpers';

export function blob(byteSize: number) {
  return {
    write(buf: Buffer, offset: number) {
      const bytesArrayBuf = Buffer.allocUnsafe(this.byteSize);
      bytesArrayBuf.copy(buf, offset, 0, this.byteSize);
    },
    read(buf: Buffer, offset: number): Buffer {
      return buf.slice(offset, offset + this.byteSize);
    },
    byteSize,
    description: 'blob',
  };
}
export type BuffersExports = keyof typeof import('./buffers');
export type BuffersTypeMapKey = 'blob';

export type BuffersTypeMap = Record<
  BuffersTypeMapKey,
  SupportedTypeDefinition & { beet: BuffersExports }
>;

export const buffersTypeMap: BuffersTypeMap = {
  blob: {
    beet: 'blob',
    isFixable: false,
    sourcePack: BEET_SONARWATCH_PACKAGE,
    ts: 'Buffer',
    pack: BEET_SONARWATCH_PACKAGE,
  },
};
