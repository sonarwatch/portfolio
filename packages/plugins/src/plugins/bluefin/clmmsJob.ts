import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  clmmsPoolsKey,
  platformId,
  clmmPoolCreatedEventType,
  clmmPoolsApiUrl,
} from './constants';
import { getClientSui } from '../../utils/clients';
import { ClmmPool, ClmmPoolStat } from './types';
import { queryEventsSafe } from '../../utils/sui/queryEventsSafe';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const poolCreatedEvents = await queryEventsSafe<{
    id: string;
  }>(client, {
    MoveEventType: clmmPoolCreatedEventType,
  });
  const poolIds = poolCreatedEvents.map((e) => e.parsedJson?.id) as string[];

  const [pools, apiRes] = await Promise.all([
    multiGetObjects<ClmmPool>(client, poolIds),
    axios.get<ClmmPoolStat[]>(clmmPoolsApiUrl).catch(() => null), // fail silently
  ]);

  await cache.setItem(
    clmmsPoolsKey,
    pools.map((p) => {
      const poolStat = apiRes?.data.find(
        (s) => p.data?.content && s.address === p.data.content.fields.id.id
      );
      return { ...p, stats: { ...poolStat } };
    }),
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );
};

const job: Job = {
  id: `${platformId}-clmms`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};

export default job;
