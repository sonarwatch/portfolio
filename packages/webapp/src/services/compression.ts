import { compress, decompress } from '@mongodb-js/zstd';

class CompressionService {
  private static instance: CompressionService;

  public static getInstance(): CompressionService {
    if (!CompressionService.instance) {
      CompressionService.instance = new CompressionService();
    }
    return CompressionService.instance;
  }

  public compress = async (data: any): Promise<string> => {
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const compressed = await compress(dataBuffer);
    return compressed.toString('base64');
  };

  public decompress = async (compressed: string): Promise<Record<string, any>> => {
    const dataBuffer = Buffer.from(compressed, 'base64');
    const decompressed = await decompress(dataBuffer);
    return JSON.parse(decompressed.toString('utf-8'));
  };
}

export default CompressionService.getInstance();
