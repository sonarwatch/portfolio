import { NetworkId, parseTypeString } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { getClientSui } from '../../../utils/clients';
import {
  MODULE_CLOB,
  PACKAGE_ID,
  PoolCreatedEvent,
  poolsCacheKey,
} from './constants';
import { queryEvents } from '../../../utils/sui/queryEvents';
import { normalizeStructTag } from '../helpers';
import { platformId } from '../constants';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const pools = (
    await queryEvents<{ pool_id: string }>(client, {
      MoveEventModule: {
        module: MODULE_CLOB,
        package: PACKAGE_ID,
      },
    })
  )
    .filter((e) => e.type.startsWith(PoolCreatedEvent))
    .map((e) => {
      const { keys } = parseTypeString(e.type);
      return (
        e.parsedJson &&
        keys && {
          poolId: e.parsedJson.pool_id as string,
          baseAsset: normalizeStructTag(keys[0]?.type),
          quoteAsset: normalizeStructTag(keys[1].type),
        }
      );
    });

  await cache.setItem(poolsCacheKey, pools, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-v3-pools`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
