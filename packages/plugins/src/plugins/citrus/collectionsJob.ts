import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  cachePrefix,
  citrusIdlItem,
  collectionDataSize,
  collectionsCacheKey,
  platformId,
} from './constants';
import { CollectionConfig } from './types';
import { getClientSolana } from '../../utils/clients';
import { getAutoParsedProgramAccounts } from '../../utils/solana';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getAutoParsedProgramAccounts<CollectionConfig>(
    connection,
    citrusIdlItem,
    [
      {
        dataSize: collectionDataSize,
      },
    ]
  );

  await cache.setItem(collectionsCacheKey, accounts, {
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
