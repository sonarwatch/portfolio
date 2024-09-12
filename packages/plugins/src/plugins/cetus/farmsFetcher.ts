import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { clmmPoolsPrefix, farmNftType, platformId } from './constants';
import { getClientSui } from '../../utils/clients';

import { WrappedPositionNFT, Pool, Farm } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { wrappedPositionToTokenAmounts } from './helpers';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const positions = await getOwnedObjects<WrappedPositionNFT>(client, owner, {
    options: {
      showContent: true,
    },
    filter: {
      StructType: farmNftType,
    },
  });
  if (positions.length === 0) return [];

  const farms = await multiGetObjects<Farm>(
    client,
    positions
      .map((position) => position.data?.content?.fields.pool_id)
      .filter((s) => s !== null) as string[]
  );

  const pools = (
    await cache.getItems<Pool>(
      farms
        .map((farm) => farm.data?.content?.fields.clmm_pool_id)
        .filter((s) => s !== null) as string[],
      {
        prefix: clmmPoolsPrefix,
        networkId: NetworkId.sui,
      }
    )
  ).filter((p) => p !== null) as Pool[];

  const mints: string[] = [];

  pools.forEach((pool) => {
    mints.push(
      formatMoveTokenAddress(pool.coinTypeA),
      formatMoveTokenAddress(pool.coinTypeB)
    );
  });

  const elements: PortfolioElement[] = [];
  const tokenPrices = await cache.getTokenPricesAsMap(mints, NetworkId.sui);

  positions.forEach((position) => {
    if (!position.data?.content?.fields) return;

    const farm = farms.find(
      (f) => f.data?.objectId === position.data?.content?.fields.pool_id
    );
    if (!farm) return;

    const pool = pools.find(
      (p) => p.poolAddress === farm.data?.content?.fields.clmm_pool_id
    );
    if (!pool) return;

    const { tokenAmountA, tokenAmountB } = wrappedPositionToTokenAmounts(
      position.data?.content?.fields,
      pool
    );

    if (tokenAmountA.isZero() && tokenAmountB.isZero()) return;

    const coinTypeA = formatMoveTokenAddress(pool.coinTypeA);
    const coinTypeB = formatMoveTokenAddress(pool.coinTypeB);

    const tokenPriceA = tokenPrices.get(coinTypeA);
    const tokenPriceB = tokenPrices.get(coinTypeB);

    const assets = [];

    if (tokenAmountA.isGreaterThan(0) && tokenPriceA) {
      assets.push(
        tokenPriceToAssetToken(
          tokenPriceA.address,
          tokenAmountA.dividedBy(10 ** tokenPriceA.decimals).toNumber(),
          NetworkId.sui,
          tokenPriceA
        )
      );
    }
    if (tokenAmountB.isGreaterThan(0) && tokenPriceB) {
      assets.push(
        tokenPriceToAssetToken(
          tokenPriceB.address,
          tokenAmountB.dividedBy(10 ** tokenPriceB.decimals).toNumber(),
          NetworkId.sui,
          tokenPriceB
        )
      );
    }

    const liquidities = [
      {
        assets,
        assetsValue: getUsdValueSum(assets.map((a) => a.value)),
        rewardAssets: [],
        rewardAssetsValue: 0,
        value: getUsdValueSum(assets.map((a) => a.value)),
        yields: [],
      },
    ];

    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.sui,
      platformId,
      label: 'Farming',
      value: getUsdValueSum(liquidities.map((a) => a.value)),
      data: {
        liquidities,
      },
    });
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-farms`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
