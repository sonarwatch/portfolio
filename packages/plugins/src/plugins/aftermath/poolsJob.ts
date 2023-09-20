import { getObjectFields, getObjectId } from '@mysten/sui.js';
import BigNumber from 'bignumber.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSui } from '../../utils/clients';
import { lpCoinsTable, platformId } from './constants';
import { PoolInfo } from './types';
import computeAndStoreLpPrice, {
  PoolData,
} from '../../utils/misc/computeAndStoreLpPrice';
import getMultipleSuiObjectsSafe from '../../utils/sui/getMultipleObjectsSafe';
import getDynamicFieldsSafe from '../../utils/sui/getDynamicFieldsSafe';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSui();

  const coinsTableFields = await getDynamicFieldsSafe(client, lpCoinsTable);

  const poolFactoryIds = coinsTableFields.map(getObjectId);
  if (!poolFactoryIds.length) return;

  const pObjects = await getMultipleSuiObjectsSafe(client, poolFactoryIds, {
    showContent: true,
  });

  const poolsIds = pObjects
    .map((poolObject) => {
      if (poolObject.data && poolObject.data.content) {
        const fields = getObjectFields(poolObject) as {
          id: { id: string };
          name: string;
          value: string;
        };
        if (fields.value) return fields.value;
      }
      return [];
    })
    .flat();
  if (!poolsIds.length) return;

  const poolsInfo = await getMultipleSuiObjectsSafe(client, poolsIds, {
    showContent: true,
  });

  for (const pool of poolsInfo) {
    if (!pool.data || !pool.data.content) continue;
    const poolInfo = getObjectFields(pool) as PoolInfo;

    if (poolInfo.lp_supply.fields.value === '0') continue;

    if (poolInfo.normalized_balances.length > 2) {
      // TODO : handle more than 2 tokens by LP
      continue;
    } else {
      const poolData: PoolData = {
        id: poolInfo.id.id,
        lpDecimals: poolInfo.lp_decimals,
        mintTokenX: `0x${poolInfo.type_names[0]}`,
        decimalX: poolInfo.coin_decimals[0],
        mintTokenY: `0x${poolInfo.type_names[1]}`,
        decimalY: poolInfo.coin_decimals[1],
        reserveTokenX: new BigNumber(poolInfo.normalized_balances[0]).dividedBy(
          poolInfo.decimal_scalars[0]
        ),
        reserveTokenY: new BigNumber(poolInfo.normalized_balances[1]).dividedBy(
          poolInfo.decimal_scalars[1]
        ),
        supply: new BigNumber(poolInfo.lp_supply.fields.value),
      };
      await computeAndStoreLpPrice(cache, poolData, NetworkId.sui, platformId);
    }
  }
};

const job: Job = {
  id: `${platformId}-pools`,
  executor,
};
export default job;
