import { Cache, Job, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import {
  reservesPrefix as prefix,
  platformId,
  marketsEndpoint,
} from './constants';
import { MarketInfo } from './types';
import { upperFirst } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const marketsInfoRes: AxiosResponse<MarketInfo[]> = await axios.get(
    marketsEndpoint
  );
  const marketsInfo = marketsInfoRes.data;
  const markets: Map<string, MarketInfo> = new Map();
  for (const marketInfo of marketsInfo) {
    markets.set(marketInfo.address, {
      ...marketInfo,
      name: upperFirst(marketInfo.name),
    });
    cache.setItem(
      marketInfo.address,
      {
        ...marketInfo,
        name: upperFirst(marketInfo.name),
      },
      {
        prefix,
        networkId: NetworkId.solana,
      }
    );
  }
};

const job: Job = {
  id: `${platformId}-markets`,
  executor,
};
export default job;
