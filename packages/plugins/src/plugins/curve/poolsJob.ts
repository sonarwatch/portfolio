import {
  TokenPrice,
  formatTokenAddress,
  NetworkId
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  poolsCachePrefix,
  platformId,
  crvNetworkIds,
  crvNetworkIdBySwNetworkId,
  poolsByAddressPrefix,
} from './constants';
import { PoolDatum } from './getPoolsTypes';
import { getPoolsData } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  for (let i = 0; i < crvNetworkIds.length; i++) {
    const crvNetworkId = crvNetworkIds[i];
    const networkId = crvNetworkIdBySwNetworkId[crvNetworkId];

    const pools = await getPoolsData(crvNetworkId);
    const coinsAddresses = [
      ...new Set(
        pools
          .map((pool) =>
            (pool.underlyingCoins || pool.coins).map((c) => c.address)
          )
          .flat()
      ),
    ];
    const tokenPrices = await cache.getTokenPrices(coinsAddresses, networkId);
    const tokenPricesByAddress: Map<string, TokenPrice> = new Map();
    tokenPrices.forEach((tp) => {
      if (!tp) return;
      tokenPricesByAddress.set(tp.address, tp);
    });

    for (let j = 0; j < pools.length; j++) {
      const pool = pools[j];
      const coins = pool.underlyingCoins || pool.coins;
      const coinsTokenPrices = coins.reduce(
        (obj: Record<string, TokenPrice>, coin) => {
          const tokenPrice = tokenPricesByAddress.get(
            formatTokenAddress(coin.address, networkId)
          );
          if (!tokenPrice) return obj;
          // eslint-disable-next-line no-param-reassign
          obj[coin.address] = tokenPrice;
          return obj;
        },
        {}
      );

      await cache.setItem<PoolDatum>(
        pool.address,
        { ...pool, coinsTokenPrices },
        {
          prefix: poolsCachePrefix,
          networkId,
        }
      );
    }

    const poolsByAddresses: Map<string, string> = new Map();
    pools.forEach((p) => {
      poolsByAddresses.set(p.lpTokenAddress, p.address);
      if (p.gaugeAddress) poolsByAddresses.set(p.gaugeAddress, p.address);
    });
    await cache.setItem(
      poolsByAddressPrefix,
      Object.fromEntries(poolsByAddresses),
      {
        prefix: poolsByAddressPrefix,
        networkId,
      }
    );
  }
};
const job: Job = {
  id: `${platformId}-pools`,
  networkIds: [NetworkId.ethereum, NetworkId.polygon, NetworkId.avalanche],
  executor,
  labels: ['normal', NetworkId.ethereum, NetworkId.polygon, NetworkId.avalanche],
};
export default job;
