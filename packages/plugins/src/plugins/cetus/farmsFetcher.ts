import {
  formatMoveTokenAddress,
  getUsdValueSum,
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { clmmPoolsPrefix, farmNftType, platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import { WrappedPositionNFT, Pool, Farm } from './types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getOwnedObjects } from '../../utils/sui/getOwnedObjects';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { bitsToNumber } from '../../utils/sui/bitsToNumber';
import { getTokenAmountsFromLiquidity } from '../../utils/clmm/tokenAmountFromLiquidity';

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

  const [farms, pools] = await Promise.all([
    multiGetObjects<Farm>(
      client,
      positions
        .map((position) => position.data?.content?.fields.pool_id)
        .filter((s) => s !== null) as string[]
    ),
    cache
      .getItems<Pool>(
        positions
          .map(
            (position) =>
              position.data?.content?.fields.clmm_postion.fields.pool
          )
          .filter((s) => s !== null) as string[],
        {
          prefix: clmmPoolsPrefix,
          networkId: NetworkId.sui,
        }
      )
      .then((res) => res.filter((p) => p !== null) as Pool[]),
  ]);

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
    if (!farm || !farm.data?.content?.fields.effective_tick_lower) return;

    const pool = pools.find(
      (p) =>
        p.poolAddress ===
        position.data?.content?.fields.clmm_postion.fields.pool
    );
    if (!pool) return;

    const tickLowerIndex = bitsToNumber(
      position.data.content.fields.clmm_postion.fields.tick_lower_index.fields
        .bits
    );
    const tickUpperIndex = bitsToNumber(
      position.data.content.fields.clmm_postion.fields.tick_upper_index.fields
        .bits
    );
    const effectiveTickLower = bitsToNumber(
      farm.data.content.fields.effective_tick_lower.fields.bits
    );
    const effectiveTickUpper = bitsToNumber(
      farm.data.content.fields.effective_tick_upper.fields.bits
    );

    const { tokenAmountA, tokenAmountB } = getTokenAmountsFromLiquidity(
      new BigNumber(position.data.content.fields.clmm_postion.fields.liquidity),
      pool.current_tick_index,
      tickLowerIndex < effectiveTickLower ? effectiveTickLower : tickLowerIndex,
      tickUpperIndex < effectiveTickUpper ? tickUpperIndex : effectiveTickUpper,
      false
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
