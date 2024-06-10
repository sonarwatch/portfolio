import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { cachePrefix, collectionsCacheKey, platformId } from './constants';
import { Collection } from './types';
import { collectionNames } from './collectionNames';

const executor: JobExecutor = async (cache: Cache) => {
  const floorPrices = await axios
    .get(`https://sharky.fi/api/floor-prices`, {
      timeout: 5000,
    })
    .catch((err) => {
      throw Error(`SHARKY_API ERR: ${err}`);
    });

  const collections: Collection[] = [];

  collectionNames.forEach((c) => {
    if (!c.environmentName && !c.disabled)
      collections.push({
        orderBook: c.orderBookPubKey,
        name: c.collectionName,
        floor: floorPrices.data.floorPrices[c.collectionName]?.floorPriceSol,
        tensor_id: floorPrices.data.floorPrices[c.collectionName]?.tensor?.slug,
      });
  });

  await cache.setItem(collectionsCacheKey, collections, {
    prefix: cachePrefix,
    networkId: NetworkId.solana,
  });
};
const job: Job = {
  id: `${platformId}-collections`,
  executor,
  label: 'normal',
};
export default job;
