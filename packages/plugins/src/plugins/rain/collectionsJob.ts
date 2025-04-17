import { NetworkId } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { collectionsKey, platformId, rainApiV3 } from './constants';
import { CollectionResponse } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const getCollectionsRes: AxiosResponse<CollectionResponse> | null =
    await axios.get(`${rainApiV3}collection/collections`);
  if (!getCollectionsRes || !getCollectionsRes.data)
    throw new Error('No collections');
  const { collections } = getCollectionsRes.data;

  await cache.setItem(collectionsKey, collections, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-collections`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
