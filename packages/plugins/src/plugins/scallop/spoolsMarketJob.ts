import { NetworkId } from '@sonarwatch/portfolio-core';
import { getObjectFields } from '@mysten/sui.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { addressKey, addressPrefix, spoolsKey, spoolsPrefix as prefix, baseIndexRate } from './constants';
import { AddressInfo, SpoolCoin, SpoolJobResult } from './types';
import { getClientSui } from '../../utils/clients';

const client = getClientSui();

const executor: JobExecutor = async (cache: Cache) => {
  const address = await cache.getItem<AddressInfo>(addressKey, {
    prefix: addressPrefix,
    networkId: NetworkId.sui
  });

  if (!address) return;

  const spoolCoin = new Map<string, SpoolCoin>(Object.entries(address.mainnet.spool.pools));
  const spoolCoinNames: string[] = Array.from(spoolCoin.keys());
  const spoolMarketData: SpoolJobResult = {};

  for (const coinName of spoolCoinNames) {
    const detail = spoolCoin.get(coinName);
    if (!detail) continue;
    const { id: poolId, rewardPoolId } = detail;

    const [stakeObjectResponse, rewardObjectResponse] = await Promise.all([
      client.getObject({
        id: poolId,
        options: {
          showContent: true
        }
      }),
      client.getObject({
        id: rewardPoolId,
        options: {
          showContent: true
        }
      })
    ]);

    if (stakeObjectResponse.data && rewardObjectResponse.data) {
      const stakeFields = getObjectFields(stakeObjectResponse);
      const rewardFields = getObjectFields(rewardObjectResponse);
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
      const remainingPoints = BigNumber(maxPoint).minus(
        distributedPoint
      );
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
        exchangeRateDenominator: Number(rewardFields['exchange_rate_numerator']),
        exchangeRateNumerator: Number(rewardFields['exchange_rate_denominator']),
      }
    }
  }

  await cache.setItem(
    spoolsKey,
    spoolMarketData,
    {
      prefix,
      networkId: NetworkId.sui
    }
  );
};

const job: Job = {
  id: prefix,
  executor,
};
export default job;
