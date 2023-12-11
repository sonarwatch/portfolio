import {
  EvmNetworkIdType,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId, poolsAndGaugesV2CacheKey } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { GaugesByPool } from './types';
import { getBalances } from '../../utils/evm/getBalances';
import { getLiquidity } from '../../utils/evm/getLiquidity';

type UserBalance = {
  poolAddress: string;
  poolBalance: bigint | null;
  gauges: {
    gaugeAddress: string;
    gaugeBalance: bigint;
  }[];
};

function getPoolsV2Fetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const gaugesByPool = await cache.getItem<GaugesByPool>(
      poolsAndGaugesV2CacheKey,
      {
        prefix: platformId,
        networkId,
      }
    );
    if (!gaugesByPool) return [];

    const poolAddresses = Object.keys(gaugesByPool);
    const gaugeAddresses = Object.values(gaugesByPool).flat();
    const poolBalances = await getBalances(owner, poolAddresses, networkId);
    const gaugeBalances = await getBalances(owner, gaugeAddresses, networkId);

    const usefulPoolAddresses: string[] = [];
    const userBalances: UserBalance[] = [];
    let gaugeCount = 0;
    for (let i = 0; i < poolAddresses.length; i++) {
      const poolAddress = poolAddresses[i];
      const poolBalance = poolBalances[i];
      const cGaugeAddresses = gaugesByPool[poolAddress];
      const userBalance: UserBalance = {
        poolAddress,
        poolBalance,
        gauges: [],
      };
      for (let j = 0; j < cGaugeAddresses.length; j++) {
        const gaugeAddress = cGaugeAddresses[j];
        const gaugeBalance = gaugeBalances[gaugeCount + j];
        if (gaugeBalance) {
          userBalance.gauges.push({
            gaugeAddress,
            gaugeBalance,
          });
        }
      }
      gaugeCount += cGaugeAddresses.length;

      if (userBalance.poolBalance || userBalance.gauges.length !== 0) {
        userBalances.push(userBalance);
        usefulPoolAddresses.push(poolAddress);
      }
    }
    if (usefulPoolAddresses.length === 0) return [];
    const tokenPrices = await cache.getTokenPrices(
      usefulPoolAddresses,
      networkId
    );

    const poolLiquidities: PortfolioLiquidity[] = [];
    const farmLiquidities: PortfolioLiquidity[] = [];
    userBalances.forEach((userBalance, i) => {
      const tokenPrice = tokenPrices[i];
      if (!tokenPrice) return;
      if (userBalance.poolBalance) {
        const liquidity = getLiquidity(userBalance.poolBalance, tokenPrice);
        poolLiquidities.push(liquidity);
      }
      userBalance.gauges.forEach((gauge) => {
        const liquidity = getLiquidity(gauge.gaugeBalance, tokenPrice);
        farmLiquidities.push(liquidity);
      });
    });

    const elements: PortfolioElementLiquidity[] = [];
    if (poolLiquidities.length !== 0) {
      elements.push({
        type: PortfolioElementType.liquidity,
        label: 'LiquidityPool',
        networkId,
        platformId,
        value: getUsdValueSum(poolLiquidities.map((a) => a.value)),
        name: 'Balancer V2',
        data: {
          liquidities: poolLiquidities,
        },
      });
    }
    if (farmLiquidities.length !== 0) {
      elements.push({
        type: PortfolioElementType.liquidity,
        label: 'Farming',
        networkId,
        platformId,
        value: getUsdValueSum(farmLiquidities.map((a) => a.value)),
        name: 'Balancer V2',
        data: {
          liquidities: farmLiquidities,
        },
      });
    }
    return elements;
  };

  return {
    id: `${platformId}-${networkId}-v2`,
    networkId,
    executor,
  };
}
export default getPoolsV2Fetcher;
