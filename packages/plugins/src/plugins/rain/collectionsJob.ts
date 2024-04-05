import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { collectionsKey, platformId } from './constants';
import { getCollections } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const collections = await getCollections();
  const promises = [];
  for (const collecion of collections) {
    promises.push(
      cache.setItem(collecion.collectionId.toString(), collecion, {
        prefix: platformId,
        networkId: NetworkId.solana,
      })
    );
  }
  promises.push(
    cache.setItem(collectionsKey, collections, {
      prefix: platformId,
      networkId: NetworkId.solana,
    })
  );

  await Promise.all(promises);
};

const job: Job = {
  id: `${platformId}-collections`,
  executor,
  label: 'normal',
};
export default job;
