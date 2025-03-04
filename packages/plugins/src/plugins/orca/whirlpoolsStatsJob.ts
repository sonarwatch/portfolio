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
      `https://stats-api.mainnet.orca.so/api/whirlpools?limit=1000&after=${
        cursor || ''
      }`
    );
    apiRes.data.data.forEach((p) => {
      cacheItems.push({
        key: `${p.address}-stats`,
        value: {
          address: p.address,
          volumeUsdc24h: p.volumeUsdc24h,
          tvlUsdc: p.tvlUsdc,
          feesUsdc24h: p.feesUsdc24h,
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
  executor,
  labels: ['normal'],
};
export default job;
