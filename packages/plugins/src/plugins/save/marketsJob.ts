import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import {
  marketsPrefix as prefix,
  platformId,
  marketsEndpoint,
  marketsKey,
} from './constants';
import { MarketInfo } from './types';
import { upperFirst } from './helpers';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';

const executor: JobExecutor = async (cache: Cache) => {
  const marketsInfoRes: AxiosResponse<MarketInfo[]> = await axios.get(
    marketsEndpoint
  );
  const marketsInfo = marketsInfoRes.data;
  const marketsEnhanced: MarketInfo[] = [];
  for (const marketInfo of marketsInfo) {
    marketsEnhanced.push({
      ...marketInfo,
      name: upperFirst(marketInfo.name),
    });
    await cache.setItem(
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
  await cache.setItem(marketsKey, marketsEnhanced, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-markets`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
