import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { bidsCacheKey, bidsStore, bidsType, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getDynamicFieldObjects } from '../../utils/sui/getDynamicFieldObjects';
import { Bid } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const objects = await getDynamicFieldObjects(client, bidsStore, {
    showContent: true,
  });

  const bids: Bid[] = objects
    .map((obj) => {
      if (obj.data?.content?.type && obj.data?.content?.type === bidsType) {
        return obj.data.content.fields as Bid;
      }
      return [];
    })
    .flat();

  await cache.setItem(bidsCacheKey, bids, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: `${platformId}-bids`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['realtime', NetworkId.sui],
};
export default job;
