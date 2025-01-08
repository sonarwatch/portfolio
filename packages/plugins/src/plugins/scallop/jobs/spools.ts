import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { SuiClient } from '@mysten/sui/client';
import { baseIndexRate, spoolsKey, spoolsPrefix } from '../constants';
import { PoolAddress, SpoolJobResult } from '../types';
import { queryMultipleObjects } from '../util';
import { Cache } from '../../../Cache';

const querySpools = async (
  client: SuiClient,
  addressData: PoolAddress,
  cache: Cache
) => {
  const spoolAddresses = Object.values(addressData).filter(
    (
      t
    ): t is typeof t & {
      spool: string;
      spoolReward: string;
      spoolName: string;
    } => !!t.spool && !!t.spoolReward
  );
  const spoolCoinNames: string[] = spoolAddresses.map((t) => t.spoolName);
  const spoolMarketData: SpoolJobResult = {};

  const poolIds = spoolAddresses.map((t) => t.spool);
  const rewardPoolIds = spoolAddresses.map(
    (t) => t.spoolReward
  );

  const poolObjects = await queryMultipleObjects(client, poolIds);
  const rewardObjects = await queryMultipleObjects(client, rewardPoolIds);

  for (let i = 0; i < spoolCoinNames.length; i++) {
    const coinName = spoolCoinNames[i];

    const stakeObjectResponse = poolObjects[i];
    const rewardObjectResponse = rewardObjects[i];
    // const [stakeObjectResponse, rewardObjectResponse] = await Promise.all([
    //   getObject(client, poolId),
    //   getObject(client, rewardPoolId),
    // ]);

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
    prefix: spoolsPrefix,
    networkId: NetworkId.sui,
  });
};

export default querySpools;
