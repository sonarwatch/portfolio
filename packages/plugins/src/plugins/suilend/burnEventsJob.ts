import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { platformId } from './constants';
import { BurnEventJSON, BurnEvents } from './types';
import { queryEvents } from '../../utils/sui/queryEvents';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const [pointsBurnEvents, capsuleBurnEvents] = await Promise.all([
    queryEvents<BurnEventJSON>(client, {
      MoveEventType:
        '0xf4e0686b311e9b9d6da7e61fc42dae4254828f5ee3ded8ab5480ecd27e46ff08::points::BurnEvent',
    }),
    queryEvents<BurnEventJSON>(client, {
      MoveEventType:
        '0xf4e0686b311e9b9d6da7e61fc42dae4254828f5ee3ded8ab5480ecd27e46ff08::capsule::BurnEvent',
    }),
  ]);

  const pointsBurnByUser = pointsBurnEvents.reduce(
    (obj: Record<string, number>, event) => {
      if (event.parsedJson)
        // eslint-disable-next-line no-param-reassign
        obj[event.sender] = BigNumber(event.parsedJson.claim_amount)
          .dividedBy(10 ** 6)
          .toNumber();
      return obj;
    },
    {}
  );

  const capsuleBurnByUser = capsuleBurnEvents.reduce(
    (obj: Record<string, number>, event) => {
      if (event.parsedJson) {
        const pastAmount = obj[event.sender];
        if (pastAmount) {
          // eslint-disable-next-line no-param-reassign
          obj[event.sender] = BigNumber(event.parsedJson.claim_amount)
            .dividedBy(10 ** 6)
            .plus(pastAmount)
            .toNumber();
        } else {
          // eslint-disable-next-line no-param-reassign
          obj[event.sender] = BigNumber(event.parsedJson.claim_amount)
            .dividedBy(10 ** 6)
            .toNumber();
        }
      }
      return obj;
    },
    {}
  );

  await cache.setItem<BurnEvents>(
    'burnEvents',
    {
      capsuleRecord: capsuleBurnByUser,
      pointsRecord: pointsBurnByUser,
    },
    { prefix: platformId, networkId: NetworkId.sui }
  );
};

const job: Job = {
  id: `${platformId}-burn-events`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
