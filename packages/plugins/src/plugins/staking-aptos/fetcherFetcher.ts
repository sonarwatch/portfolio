import {
  NetworkId,
  PortfolioElement,
  PortfolioElementLiquidity,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, stakeConfigs, stakingAptosPlatformIds } from './constants';
import { getClientAptos } from '../../utils/clients';
import { MoveResource, getAccountResources } from '../../utils/aptos';
import { StakeConfig } from './types';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, owner);
  if (!resources) return [];

  const promises = stakeConfigs.flatMap((sConfig) => {
    if (!stakingAptosPlatformIds.includes(sConfig.platformId)) return [];
    return fetchByStakeConfig(resources, sConfig, cache);
  });
  const elements = (await Promise.all(promises)).flat(1);
  return elements;
};

async function fetchByStakeConfig(
  resources: MoveResource<unknown>[],
  config: StakeConfig,
  cache: Cache
): Promise<PortfolioElement[]> {
  const assetPromises = resources.map(
    async (resource): Promise<PortfolioLiquidity | undefined> => {
      const isMatching = config.prefixes.some((p) =>
        resource.type.startsWith(p)
      );
      if (!isMatching) return undefined;

      const { amountBn, tokenAddress } = config.parseResource(resource);
      const tokenPrice = await cache.getTokenPrice(
        tokenAddress,
        NetworkId.aptos
      );
      if (!tokenPrice) return undefined;
      const amount = amountBn.div(10 ** tokenPrice.decimals).toNumber();
      const value = amount * tokenPrice.price;
      const assets = tokenPriceToAssetTokens(
        tokenAddress,
        amount,
        NetworkId.aptos,
        tokenPrice
      );

      const liquidity: PortfolioLiquidity = {
        value,
        assets,
        assetsValue: value,
        rewardAssets: [],
        rewardAssetsValue: 0,
        yields: [],
      };
      return liquidity;
    }
  );

  const results = await Promise.allSettled(assetPromises);
  const liquidities = results.reduce((liqu: PortfolioLiquidity[], result) => {
    if (result.status === 'fulfilled' && result.value) liqu.push(result.value);
    return liqu;
  }, []);
  if (liquidities.length === 0) return [];

  const elementMultiple: PortfolioElementLiquidity = {
    networkId: NetworkId.aptos,
    platformId: config.platformId,
    type: PortfolioElementType.liquidity,
    label: config.typeLabel,
    value: getUsdValueSum(liquidities.map((a) => a.value)),
    data: {
      liquidities,
    },
  };
  return [elementMultiple];
}

const fetcher: Fetcher = {
  id: `${platformId}-fetcher`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
