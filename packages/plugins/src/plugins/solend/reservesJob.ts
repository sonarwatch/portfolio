import axios, { AxiosResponse } from 'axios';
import { Cache, Job, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import {
  marketsPrefix,
  platformId,
  reserveEndpoint,
  reservesPrefix,
} from './constants';
import { ApiResponse, MarketInfo, ReserveInfo } from './types';
import sleep from '../../utils/misc/sleep';

const executor: JobExecutor = async (cache: Cache) => {
  const markets = await cache.getItems<MarketInfo>({ prefix: marketsPrefix });
  const reservesAddressesByMarket = Array.from(markets.values()).map((m) =>
    m.reserves.map((r) => r.address)
  );
  for (let i = 0; i < reservesAddressesByMarket.length; i += 1) {
    const reservesAddresses = reservesAddressesByMarket[i];
    const reservesInfoRes: void | AxiosResponse<ApiResponse<ReserveInfo>> =
      await axios
        .get(`${reserveEndpoint}${reservesAddresses.join(',')}`)
        .catch(() => {
          //
        });
    if (!reservesInfoRes) continue;
    for (let j = 0; j < reservesInfoRes.data.results.length; j += 1) {
      const reserveInfo = reservesInfoRes.data.results[j];
      cache.setItem(reservesAddresses[j], reserveInfo, {
        prefix: reservesPrefix,
        networkId: NetworkId.solana,
      });
    }
    await sleep(200);
  }
};

const job: Job = {
  id: `${platformId}-reserves`,
  executor,
};
export default job;
