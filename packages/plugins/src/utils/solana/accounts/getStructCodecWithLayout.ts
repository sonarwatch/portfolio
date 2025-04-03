import { Codec, getStructCodec } from '@solana/kit';
import { sha256 } from 'js-sha256';

type StructCodecField = [name: string, codec: Codec<any, any>];

export type CodecWithLayout<T> = Codec<T> & {
  layout: StructCodecField[];
  discriminator?: number[];
};

export function genAccDiscriminator(accName: string) {
  return Buffer.from(
    sha256.digest(
      `account:${accName.charAt(0).toLowerCase() + accName.slice(1)}`
    )
  ).subarray(0, 8);
}

export function getStructCodecWithLayout<T>(
  fields: StructCodecField[],
  discriminator?: number[]
): CodecWithLayout<T> {
  const codec: Codec<T> = getStructCodec(fields) as unknown as Codec<T>;

  return {
    ...codec,
    layout: fields,
    discriminator,
  };
}
