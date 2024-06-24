import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { collectionsKey, platformId } from './constants';
import { getCollections } from './helpers';
import { pick } from '../../utils/misc/pick';

const executor: JobExecutor = async (cache: Cache) => {
  const collections = await getCollections();
  const filteredCollections = collections
    .filter((c) => !c.isDefi)
    .map((c) => pick(c, ['collectionId', 'name', 'floorPrice']));

  await cache.setItem(collectionsKey, filteredCollections, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-collections`,
  executor,
  label: 'normal',
};
export default job;
