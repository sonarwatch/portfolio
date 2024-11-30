import {
  formatMoveTokenAddress,
  formatTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioElementType,
  PortfolioLiquidity,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { packageId, platformId, poolsKey, poolsPrefix } from './constants';
import { getClientSui } from '../../utils/clients';
import { Pool, PositionObject } from './types';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import { getOwnedObjectsPreloaded } from '../../utils/sui/getOwnedObjectsPreloaded';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const activePositions = await getOwnedObjectsPreloaded<PositionObject>(
    client,
    owner,
    {
      filter: {
        StructType: `${packageId}::position::Position`,
      },
    }
  ).then((positions) =>
    positions.filter((pos) => Number(pos.data?.content?.fields.amount) > 0)
  );
  if (activePositions.length === 0) return [];

  const pools = await cache.getItem<Pool[]>(poolsKey, {
    prefix: poolsPrefix,
    networkId: NetworkId.sui,
  });
  if (!pools) return [];

  const mints = new Set<string>();
  activePositions.forEach((position) => {
    if (!position.data?.content?.fields.pool_idx) return;
    const pool: Pool = pools[Number(position.data.content.fields.pool_idx)];
    const token = formatMoveTokenAddress(pool.lpToken);
    mints.add(token);
  });
  const tokenPrices = await cache.getTokenPricesAsMap(mints, NetworkId.sui);

  const liquidities: PortfolioLiquidity[] = [];
  for (const position of activePositions) {
    if (
      !position.data?.content?.fields.pool_idx ||
      position.data?.content?.fields?.amount === '0'
    )
      continue;
    const pool = pools.at(Number(position.data.content.fields.pool_idx));
    if (!pool) continue;

    const coinType = pool.lpToken;
    const tokenPrice = tokenPrices.get(
      formatTokenAddress(coinType, NetworkId.sui)
    );
    if (!tokenPrice) continue;

    const amount = new BigNumber(position.data?.content.fields?.amount)
      .dividedBy(10 ** tokenPrice.decimals)
      .toNumber();
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
    liquidities.push(liquidity);
  }

  if (liquidities.length === 0) return [];

  return [
    {
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.sui,
      platformId,
      label: 'Farming',
      value: getUsdValueSum(liquidities.map((a) => a.value)),
      data: {
        liquidities,
      },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-staking-pool`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
