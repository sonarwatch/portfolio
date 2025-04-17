import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, whirlpoolPrefix } from './constants';
import { WhirlpoolStat } from './types';
import sleep from '../../utils/misc/sleep';

type ApiResStruct = {
  data: WhirlpoolStat[];
  meta: {
    cursor: {
      previous?: string;
      next?: string;
    };
  };
};

const executor: JobExecutor = async (cache: Cache) => {
  let hasNextPage = true;
  let cursor: string | null | undefined;

  const cacheItems: { key: string; value: WhirlpoolStat }[] = [];

  do {
    const apiRes: AxiosResponse<ApiResStruct> = await axios.get(
      `https://api.orca.so/v2/solana/pools?limit=1000&after=${cursor || ''}`
    );
    apiRes.data.data.forEach((p) => {
      cacheItems.push({
        key: `${p.address}-stats`,
        value: {
          address: p.address,
          stats: {
            '24h': {
              volume: p.stats['24h'].volume,
              fees: p.stats['24h'].fees,
            },
          },
          tvlUsdc: p.tvlUsdc,
        },
      });
    });

    cursor = apiRes.data.meta.cursor.next;
    hasNextPage = !!cursor;

    await sleep(1000);
  } while (hasNextPage);

  await cache.setItems(cacheItems, {
    prefix: whirlpoolPrefix,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-whirlpools-stats`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
