import {
  formatMoveTokenAddress, getUsdValueSum,
  NetworkId,
  PortfolioElement, PortfolioElementType, PortfolioLiquidity
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { flowxPackage, platformId, poolsKey, poolsPrefix } from './constants';
import { getClientSui } from '../../utils/clients';
import { Pool, Pools, PositionObject } from './types';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { getLpTag, parseLpTag } from '../tokens/helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const elements: PortfolioElement[] = [];

  const client = getClientSui();

  const activePositions = await getOwnedObjects<PositionObject>(client, owner, {
    "filter": {
      "StructType": `${flowxPackage}::position::Position`
    },
    "options": {
      "showContent": true
    }
  }).then((positions) => positions.filter((pos) => Number(pos.data?.content?.fields.amount) > 0));

  const pools: Pools | undefined = await cache.getItem(poolsKey, {
    prefix: poolsPrefix,
    networkId: NetworkId.sui,
  });

  const liquiditiesByTag: Record<string, PortfolioLiquidity[]> = {};

  for (const position of activePositions) {
    if (!position.data || !position.data.content || !position.data.content.fields.pool_idx || !pools) continue;
    const pool: Pool = pools[position.data.content.fields.pool_idx];

    const coinType = pool.lpToken;
    const tokenPrice = await cache.getTokenPrice(formatMoveTokenAddress(coinType), NetworkId.sui);
    if (!tokenPrice) continue;

    const amount = new BigNumber(position.data?.content.fields?.amount).dividedBy(10 ** tokenPrice.decimals).toNumber();

    const assets = tokenPriceToAssetTokens(
      coinType,
      amount,
      NetworkId.sui,
      tokenPrice
    );
    const liquidity: PortfolioLiquidity = {
      assets,
      assetsValue: getUsdValueSum(assets.map((a) => a.value)),
      rewardAssets: [],
      rewardAssetsValue: 0,
      value: getUsdValueSum(assets.map((a) => a.value)),
      yields: [],
      name: tokenPrice.liquidityName,
    };
    const tag = getLpTag(tokenPrice.platformId, tokenPrice.elementName);
    if (!liquiditiesByTag[tag]) {
      liquiditiesByTag[tag] = [];
    }
    liquiditiesByTag[tag].push(liquidity);
  }

  for (const [tag, liquidities] of Object.entries(liquiditiesByTag)) {
    const { elementName } = parseLpTag(tag);
    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.sui,
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
};

const fetcher: Fetcher = {
  id: `${platformId}-pool`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
