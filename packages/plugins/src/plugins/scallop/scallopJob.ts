import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { marketPrefix as prefix } from './constants';

import {
  queryAddress,
  queryMarkets,
  queryPoolAddress,
  querySpools,
} from './jobs';
import { queryBorrowIncentivePools } from './queries';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();
  const [addressInfo, poolAddress] = await Promise.all([
    queryAddress(cache),
    queryPoolAddress(cache),
  ]);
  if (!addressInfo || !poolAddress) return;

  const market = await queryMarkets(client, poolAddress, cache);

  await Promise.all([
    querySpools(client, poolAddress, cache),
    queryBorrowIncentivePools(
      client,
      { addressInfo, poolAddress, market },
      cache
    ),
  ]);
};

const job: Job = {
  id: prefix,
  executor,
  label: 'normal',
};

export default job;
