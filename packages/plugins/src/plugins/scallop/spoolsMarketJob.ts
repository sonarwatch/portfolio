import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  addressKey,
  addressPrefix,
  spoolsKey,
  spoolsPrefix as prefix,
  baseIndexRate,
} from './constants';
import { AddressInfo, SpoolCoin, SpoolJobResult } from './types';
import { getObject } from '../../utils/sui/getObject';
import { getClientSui } from '../../utils/clients';

const executor: JobExecutor = async (cache: Cache) => {
  const address = await cache.getItem<AddressInfo>(addressKey, {
    prefix: addressPrefix,
    networkId: NetworkId.sui,
  });

  if (!address) return;

  const spoolCoin = new Map<string, SpoolCoin>(
    Object.entries(address.mainnet.spool.pools)
  );
  const spoolCoinNames: string[] = Array.from(spoolCoin.keys());
  const spoolMarketData: SpoolJobResult = {};
  const client = getClientSui();
  for (const coinName of spoolCoinNames) {
    const detail = spoolCoin.get(coinName);
    if (!detail) continue;
    const { id: poolId, rewardPoolId } = detail;

    const [stakeObjectResponse, rewardObjectResponse] = await Promise.all([
      getObject(client, poolId),
      getObject(client, rewardPoolId),
    ]);

    if (stakeObjectResponse.data && rewardObjectResponse.data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stakeFields = stakeObjectResponse.data.content?.fields as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rewardFields = rewardObjectResponse.data.content?.fields as any;

      if (!stakeFields || !rewardFields) continue;
      const staked = stakeFields['stakes'];
      const lastUpdate = stakeFields['last_update'];
      const period = stakeFields['point_distribution_time'];
      const maxPoint = stakeFields['max_distribution_point'];
      const distributedPoint = stakeFields['distributed_point'];
      const pointPerPeriod = stakeFields['distributed_point_per_period'];
      const { index } = stakeFields;

      const timeDelta = BigNumber(
        Math.floor(new Date().getTime() / 1000) - lastUpdate
      )
        .dividedBy(period)
        .toFixed(0);
      const remainingPoints = BigNumber(maxPoint).minus(distributedPoint);
      const accumulatedPoints = BigNumber.minimum(
        BigNumber(timeDelta).multipliedBy(pointPerPeriod),
        remainingPoints
      );

      if (!spoolMarketData[coinName]) {
        spoolMarketData[coinName] = {
          currentPointIndex: BigNumber(0),
          exchangeRateDenominator: 0,
          exchangeRateNumerator: 0,
        };
      }

      spoolMarketData[coinName] = {
        currentPointIndex: BigNumber(index).plus(
          accumulatedPoints.dividedBy(staked).isFinite()
            ? BigNumber(baseIndexRate)
                .multipliedBy(accumulatedPoints)
                .dividedBy(staked)
            : BigNumber(0)
        ),
        exchangeRateDenominator: Number(
          rewardFields['exchange_rate_numerator']
        ),
        exchangeRateNumerator: Number(
          rewardFields['exchange_rate_denominator']
        ),
      };
    }
  }

  await cache.setItem(spoolsKey, spoolMarketData, {
    prefix,
    networkId: NetworkId.sui,
  });
};

const job: Job = {
  id: prefix,
  networkIds: [NetworkId.sui],
  executor,
  labels: ['normal', NetworkId.sui],
};
export default job;
