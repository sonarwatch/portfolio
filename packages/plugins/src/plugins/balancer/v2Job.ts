import {
  NetworkId,
  TokenPrice,
  TokenPriceSource,
  TokenPriceUnderlying,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { platformId, poolsAndGaugesV2CacheKey } from './constants';
import { getBalancerPoolsV2 } from './helpers/pools';
import { getBalancerGaugesV2 } from './helpers/gauges';
import { GaugesByPool } from './types';

const poolConfigs = [
  {
    poolsUrl:
      'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
    gaugesUrl:
      'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges',
    networkId: NetworkId.ethereum,
  },
  {
    poolsUrl:
      'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-avalanche-v2',
    gaugesUrl:
      'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-avalanche',
    networkId: NetworkId.avalanche,
  },
  {
    poolsUrl:
      'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2',
    gaugesUrl:
      'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-polygon',
    networkId: NetworkId.polygon,
  },
];

const executor: JobExecutor = async (cache: Cache) => {
  for (let k = 0; k < poolConfigs.length; k++) {
    const poolConfig = poolConfigs[k];
    const { networkId, poolsUrl, gaugesUrl } = poolConfig;

    const pools = await getBalancerPoolsV2(poolsUrl);
    const gaugesByPool = await getBalancerGaugesV2(gaugesUrl, networkId);
    const underlyingAddresses = [
      ...new Set(pools.map((p) => p.tokens.map((t) => t.address)).flat()),
    ];

    const tokenPrices = await cache.getTokenPrices(
      underlyingAddresses,
      networkId
    );
    const tokenPricesByAddress: Map<string, TokenPrice> = new Map();
    tokenPrices.forEach((tp) => {
      if (!tp) return;
      tokenPricesByAddress.set(tp.address, tp);
    });

    const gGaugesByPool: GaugesByPool = {};
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      if (!pool.address || !pool.tokens || !pool.id) continue;

      const underlyings: TokenPriceUnderlying[] = [];
      let tvl = new BigNumber(0);
      for (let j = 0; j < pool.tokens.length; j++) {
        const token = pool.tokens[j];
        const address = formatTokenAddress(token.address, networkId);
        const tokenPrice = tokenPricesByAddress.get(address);
        if (!tokenPrice) break;
        tvl = tvl.plus(new BigNumber(token.balance).times(tokenPrice.price));
        underlyings.push({
          networkId,
          address,
          decimals: token.decimals,
          price: tokenPrice.price,
          amountPerLp: new BigNumber(token.balance)
            .div(pool.totalShares)
            .toNumber(),
        });
      }
      if (underlyings.length !== pool.tokens.length) continue;
      if (underlyings.length === 0) continue;

      const price = tvl.div(pool.totalShares).toNumber();
      const lpAddress = formatTokenAddress(pool.address, networkId);
      const source: TokenPriceSource = {
        id: platformId,
        address: lpAddress,
        decimals: 18,
        networkId,
        platformId: 'balancer',
        price,
        timestamp: Date.now(),
        weight: 1,
        elementName: 'Balancer V2',
        underlyings,
      };
      await cache.setTokenPriceSource(source);
      const gauges = gaugesByPool[lpAddress] || [];
      gGaugesByPool[lpAddress] = gauges;
    }
    await cache.setItem(poolsAndGaugesV2CacheKey, gGaugesByPool, {
      prefix: platformId,
      networkId,
    });
  }
};
const job: Job = {
  id: `${platformId}-v2`,
  networkIds: [],
  executor,
  labels: ['normal', NetworkId.ethereum, NetworkId.avalanche, NetworkId.polygon],
};
export default job;
