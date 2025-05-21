import {
  coingeckoSourceId,
  jupiterSourceId,
  NetworkId,
  TokenPriceSource,
  walletTokensPlatformId,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import axios from 'axios';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { platformId } from '../constants';
import getSourceWeight from '../../../utils/misc/getSourceWeight';
import { defaultAcceptedPairs } from '../../../utils/misc/getLpUnderlyingTokenSource';
import { getCachedDecimalsForToken } from '../../../utils/misc/getCachedDecimalsForToken';
import { minimumLiquidity } from '../../../utils/misc/computeAndStoreLpPrice';

const executor: JobExecutor = async (cache: Cache) => {
  const acceptedPairs = defaultAcceptedPairs.get(NetworkId.solana);
  if (!acceptedPairs) return;

  let apiRes;
  let page = 0;
  const limit = 100;
  do {
    apiRes = await axios.get<{
      pairs: {
        address: string;
        mint_x: string;
        mint_y: string;
        reserve_x_amount: number;
        reserve_y_amount: number;
        liquidity: string;
        current_price: number;
      }[];
      total: number;
    }>(
      `https://dlmm-api.meteora.ag/pair/all_with_pagination?page=${page}&limit=${limit}&hide_low_tvl=${minimumLiquidity.multipliedBy(
        2
      )}&include_token_mints=${acceptedPairs.join(',')}`
    );

    const tokenPriceSources: TokenPriceSource[] = [];

    const tokenPrices = await cache.getTokenPricesAsMap(
      apiRes.data.pairs
        .map((pair) => (pair ? [pair.mint_x, pair.mint_y] : []))
        .flat(),
      NetworkId.solana
    );

    for (const pair of apiRes.data.pairs) {
      const tokenPriceX = tokenPrices.get(pair.mint_x);
      const decimalsX =
        tokenPriceX?.decimals ||
        (await getCachedDecimalsForToken(cache, pair.mint_x, NetworkId.solana));

      const tokenPriceY = tokenPrices.get(pair.mint_y);
      const decimalsY =
        tokenPriceY?.decimals ||
        (await getCachedDecimalsForToken(cache, pair.mint_y, NetworkId.solana));

      if (!decimalsX || !decimalsY) continue;

      const price = pair.current_price;

      if (acceptedPairs.includes(pair.mint_x)) {
        if (!tokenPriceX) continue;
        if (
          tokenPriceY &&
          tokenPriceY.sources.some(
            (s) => s.id === coingeckoSourceId || s.id === jupiterSourceId
          )
        )
          continue;

        const tvl = new BigNumber(pair.reserve_x_amount)
          .times(tokenPriceX.price)
          .dividedBy(10 ** decimalsX);
        if (tvl.isLessThan(minimumLiquidity)) continue;

        tokenPriceSources.push({
          id: pair.address,
          weight: getSourceWeight(tvl),
          address: pair.mint_y,
          networkId: NetworkId.solana,
          platformId: walletTokensPlatformId,
          decimals: decimalsY,
          price: new BigNumber(tokenPriceX.price).dividedBy(price).toNumber(),
          timestamp: Date.now(),
        });
      } else if (acceptedPairs.includes(pair.mint_y)) {
        if (!tokenPriceY) continue;
        if (
          tokenPriceX &&
          tokenPriceX.sources.some(
            (s) => s.id === coingeckoSourceId || s.id === jupiterSourceId
          )
        )
          continue;

        const tvl = new BigNumber(pair.reserve_y_amount)
          .times(tokenPriceY.price)
          .dividedBy(10 ** decimalsY);
        if (tvl.isLessThan(minimumLiquidity)) continue;

        tokenPriceSources.push({
          id: pair.address,
          weight: getSourceWeight(tvl),
          address: pair.mint_x,
          networkId: NetworkId.solana,
          platformId: walletTokensPlatformId,
          decimals: decimalsX,
          price: new BigNumber(tokenPriceY.price)
            .multipliedBy(price)
            .toNumber(),
          timestamp: Date.now(),
        });
      }
    }

    await cache.setTokenPriceSources(tokenPriceSources);

    page += 1;
  } while (apiRes.data.total >= (page + 1) * limit);
};

const job: Job = {
  id: `${platformId}-dlmm`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal'],
};
export default job;
