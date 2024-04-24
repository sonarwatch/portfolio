import {
  formatMoveTokenAddress, formatTokenAddress, getUsdValueSum,
  NetworkId,
  PortfolioElement, PortfolioElementType, PortfolioLiquidity
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { flowxPackage, platformId, poolsKey, poolsPrefix } from './constants';
import { getClientSui } from '../../utils/clients';
import { Pool, PositionObject } from './types';
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

  const pools = await cache.getItem<Pool[]>(poolsKey, {
    prefix: poolsPrefix,
    networkId: NetworkId.sui,
  });

  if (!pools) return elements;

  const liquiditiesByTag: Record<string, PortfolioLiquidity[]> = {};

  // get tokenPrices
  const coinTypes = new Set<string>();
  activePositions.forEach((position) => {
    if (!position.data || !position.data.content || !position.data.content.fields.pool_idx) return;
    const pool: Pool = pools[Number(position.data.content.fields.pool_idx)];
    const token = formatMoveTokenAddress(pool.lpToken);
    if (!coinTypes.has(token)) coinTypes.add(token);
  });
  const tokenPrices = await cache.getTokenPricesAsMap([...coinTypes], NetworkId.sui);

  for (const position of activePositions) {
    if (!position.data || !position.data.content || !position.data.content.fields.pool_idx) continue;
    const pool: Pool = pools[Number(position.data.content.fields.pool_idx)];
    if (!pool) continue;

    const coinType = pool.lpToken;
    const tokenPrice = tokenPrices.get(formatTokenAddress(coinType, NetworkId.sui));
    if (!tokenPrice) continue;

    const amount = new BigNumber(position.data?.content.fields?.amount).dividedBy(10 ** tokenPrice.decimals).toNumber();
    if (amount === 0) continue;

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
  id: `${platformId}-staking-pool`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
