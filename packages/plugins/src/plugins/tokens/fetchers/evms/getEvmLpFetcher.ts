import {
  EvmNetworkIdType,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../../../Cache';
import { Fetcher } from '../../../../Fetcher';
import { lpAddressesCachePrefix } from '../../../../utils/misc/constants';
import { walletTokensPlatform } from '../../constants';
import { getBalances } from '../../../yearn/helpers';
import { getLpTag, parseLpTag } from '../../helpers';
import { getLiquidity } from '../../../../utils/evm/getLiquidity';

export default function getEvmLpFetcher(networkId: EvmNetworkIdType): Fetcher {
  return {
    executor: async (owner: string, cache: Cache) => {
      const res = await cache.getAllItemsAsMap<string[]>({
        networkId,
        prefix: lpAddressesCachePrefix,
      });
      const lpAddresses = [...new Set(Array.from(res.values()).flat(1))];
      if (lpAddresses.length === 0) return [];

      const balances = await getBalances(networkId, lpAddresses, owner);
      const nonZeroAddresses = lpAddresses.filter((adress, i) => {
        const balance = balances[i];
        if (!balance) return false;
        return true;
      });
      if (nonZeroAddresses.length === 0) return [];
      const tokenPrices = await cache.getTokenPrices(
        nonZeroAddresses,
        networkId
      );

      const liquiditiesByTag: Record<string, PortfolioLiquidity[]> = {};
      let index = -1;
      for (let i = 0; i < balances.length; i++) {
        const balance = balances[i];
        if (!balance) continue;
        index += 1;

        const tokenPrice = tokenPrices[index];
        if (!tokenPrice) continue;

        const liquidity = getLiquidity(balance, tokenPrice);
        const tag = getLpTag(tokenPrice.platformId, tokenPrice.elementName);
        if (!liquiditiesByTag[tag]) {
          liquiditiesByTag[tag] = [];
        }
        liquiditiesByTag[tag].push(liquidity);
      }

      const elements: PortfolioElementLiquidity[] = [];
      for (const [tag, liquidities] of Object.entries(liquiditiesByTag)) {
        const { platformId, elementName } = parseLpTag(tag);
        elements.push({
          type: PortfolioElementType.liquidity,
          networkId,
          platformId,
          name: elementName,
          label: 'LiquidityPool',
          value: getUsdValueSum(liquidities.map((a) => a.value)),
          data: {
            liquidities,
          },
        });
      }
      return elements;
    },
    id: `${walletTokensPlatform.id}-${networkId}-lp`,
    networkId,
  };
}
