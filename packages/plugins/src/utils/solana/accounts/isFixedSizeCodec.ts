import { FixedSizeCodec } from '@solana/kit';

export function isFixedSizeCodec(
  codec: any
): codec is FixedSizeCodec<any, any> {
  return typeof codec.fixedSize === 'number';
}
