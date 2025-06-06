import {
  compress as zstdCompress,
  decompress as zstdDecompress,
} from '@mongodb-js/zstd';

export const compress = async (data: any): Promise<string> => {
  const dataBuffer = Buffer.from(JSON.stringify(data));
  const compressed = await zstdCompress(dataBuffer);
  return compressed.toString('base64');
};

export const decompress = async (
  compressed: string
): Promise<any> => {
  const dataBuffer = Buffer.from(compressed, 'base64');
  const decompressed = await zstdDecompress(dataBuffer);
  return JSON.parse(decompressed.toString('utf-8'));
};
