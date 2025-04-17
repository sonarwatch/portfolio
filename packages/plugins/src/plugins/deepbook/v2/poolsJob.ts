import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSui } from '../../../utils/clients';
import { MODULE_CLOB, PACKAGE_ID, poolsCacheKey } from './constants';
import { normalizeStructTag } from '../helpers';
import { queryEvents } from '../../../utils/sui/queryEvents';
import { PoolSummary } from '../types';
import { platformId } from '../constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const events = await queryEvents<{
    pool_id: string;
    base_asset: { name: string };
    quote_asset: { name: string };
  }>(client, {
    MoveEventType: `${PACKAGE_ID}::${MODULE_CLOB}::PoolCreated`,
  });

  const pools = events
    .map(
      (e) =>
        e.parsedJson && {
          poolId: e.parsedJson.pool_id as string,
          baseAsset: normalizeStructTag(e.parsedJson.base_asset.name),
          quoteAsset: normalizeStructTag(e.parsedJson.quote_asset.name),
        }
    )
    .filter((p) => p !== null) as PoolSummary[];

  await cache.setItem(poolsCacheKey, pools, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-v2-pools`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
