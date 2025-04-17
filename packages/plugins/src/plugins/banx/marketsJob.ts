import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  banxApiCollectionsUrl,
  banxApiMarketsUrl,
  cachePrefix,
  nftMarketsCacheKey,
  splMarketsCacheKey,
  platformId,
} from './constants';
import { Collection, SplAssetMarket } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const resSpl = await axios.get<{ data: SplAssetMarket[] }>(
    banxApiMarketsUrl,
    {
      timeout: 3000,
    }
  );

  await cache.setItem(splMarketsCacheKey, resSpl.data.data, {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });

  const resNft = await axios.get<{ data: Collection[] }>(
    banxApiCollectionsUrl,
    {
      timeout: 10000,
    }
  );

  await cache.setItem(nftMarketsCacheKey, resNft.data.data, {
    prefix: cachePrefix,
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
