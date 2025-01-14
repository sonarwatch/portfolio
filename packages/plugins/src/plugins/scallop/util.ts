import { SuiClient } from '@mysten/sui/client';
import { ObjectResponse } from '../../utils/sui/types';

const partitionArray = <T>(array: T[], chunkSize: number) => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

export const queryMultipleObjects = async <T>(
  client: SuiClient,
  rawObjectIds: string[],
  partitionSize = 50
) => {
  const objectIdsPartition = partitionArray(rawObjectIds, partitionSize);

  const objects = [];
  for (const ids of objectIdsPartition) {
    const result = await client.multiGetObjects({
      ids,
      options: {
        showContent: true,
        showOwner: true,
        showType: true,
      },
    });
    objects.push(...result);
  }

  return objects as ObjectResponse<T>[];
};
