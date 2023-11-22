import { EvmNetworkIdType, formatEvmAddress } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getPools } from './helpers';
import { poolsKey } from './constants';
import getLpTokenSourceRaw from '../../utils/misc/getLpTokenSourceRaw';

export default function getPoolsJob(
  networkId: EvmNetworkIdType,
  platformId: string,
  poolsUrl: string
): Job {
  const executor: JobExecutor = async (cache: Cache) => {
    const pools = (await getPools(poolsUrl)).filter(
      (vault) => !vault.isBroken && vault.usdTotal !== '0'
    );

    const lpSources = pools.map((pool) =>
      getLpTokenSourceRaw(
        networkId,
        formatEvmAddress(pool.gaugeAddress),
        platformId,
        '',
        {
          address: formatEvmAddress(pool.gaugeAddress),
          decimals: 18,
          supplyRaw: new BigNumber(pool.totalSupply),
        },
        pool.coins.map((c) => ({
          address: c.address,
          decimals: Number(c.decimals),
          price: Number(c.usdPrice),
          reserveAmountRaw: new BigNumber(c.poolBalance),
        }))
      )
    );

    const lpSourcePromises = lpSources.map((source) =>
      cache.setTokenPriceSource(source)
    );
    const poolsItemPromise = cache.setItem(poolsKey, pools, {
      prefix: platformId,
      networkId,
    });

    await Promise.all([...lpSourcePromises, poolsItemPromise]);
  };

  return {
    executor,
    id: `${platformId}-${networkId}-pools`,
  };
}
