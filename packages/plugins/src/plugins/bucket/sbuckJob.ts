import BigNumber from 'bignumber.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { buckId, platformId, sBuckFlask, sbuckId } from './constants';
import { getClientSui } from '../../utils/clients';
import { getObject } from '../../utils/sui/getObject';
import { Flask } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const [flask, buckPrice] = await Promise.all([
    getObject<Flask>(client, sBuckFlask),
    cache.getTokenPrice(buckId, NetworkId.sui),
  ]);

  if (!buckPrice || !flask.data?.content) return;

  const ratio = new BigNumber(flask.data.content.fields.reserves).dividedBy(
    flask.data.content.fields.sbuck_supply.fields.value
  );

  await cache.setTokenPriceSource({
    id: sBuckFlask,
    weight: 1,
    address: sbuckId,
    networkId: NetworkId.sui,
    platformId,
    decimals: 9,
    price: ratio.multipliedBy(buckPrice.price).toNumber(),
    underlyings: [
      {
        networkId: NetworkId.sui,
        address: buckId,
        price: buckPrice.price,
        decimals: 9,
        amountPerLp: ratio.toNumber(),
      },
    ],
    timestamp: Date.now(),
  });
};
const job: Job = {
  id: `${platformId}-sbuck`,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
