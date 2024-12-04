import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { apiV3, platformId } from './constants';
import { ApiV3Response } from './types';
import { getLpTokenSource } from '../../utils/misc/getLpTokenSource';
import { minimumLiquidity } from '../../utils/misc/computeAndStoreLpPrice';
import { getLpUnderlyingTokenSource } from '../../utils/misc/getLpUnderlyingTokenSource';

const executor: JobExecutor = async (cache: Cache) => {
  let apiRes;
  let page = 1;
  let subPools;
  let tokenPriceById;
  let lastLiquidity;
  do {
    apiRes = await axios
      .get<ApiV3Response>(`${apiV3}pools/info/list`, {
        params: {
          poolType: 'all',
          poolSortField: 'liquidity',
          sortType: 'desc',
          pageSize: 300,
          page,
        },
      })
      .catch((er) => {
        throw new Error(
          `[Raydium AMM V2 Job] Unable to get pools info from APi. \n Error : ${er}`
        );
      });

    if (apiRes.data.data.count === 0) return;

    subPools = apiRes.data.data;
    lastLiquidity = subPools.data[subPools.count - 1].tvl;

    tokenPriceById = await cache.getTokenPricesAsMap(
      subPools.data
        .map((pool) => [pool.mintA.address, pool.mintB.address])
        .flat(),
      NetworkId.solana
    );

    let poolInfo;
    let lpSupply;
    let mintA;
    let mintB;
    let lpMint;
    let decimalsA;
    let decimalsB;
    let lpDecimals;
    let tokenAmountA;
    let tokenAmountB;
    let tokenPriceA;
    let tokenPriceB;

    const tokenPriceSources = [];

    for (let id = 0; id < subPools.data.length; id++) {
      poolInfo = subPools.data[id];
      lpSupply = new BigNumber(poolInfo.lpAmount);
      if (lpSupply.isZero()) continue;
      if (BigNumber(poolInfo.tvl).isLessThan(minimumLiquidity)) continue;

      mintA = poolInfo.mintA.address;
      mintB = poolInfo.mintB.address;

      if (poolInfo.lpMint) {
        lpMint = poolInfo.lpMint.address;
        lpDecimals = poolInfo.lpMint.decimals;
      }

      [decimalsA, decimalsB] = [
        poolInfo.mintA.decimals,
        poolInfo.mintB.decimals,
      ];

      if (!decimalsA || !decimalsB) continue;

      tokenAmountA = poolInfo.mintAmountA;
      tokenAmountB = poolInfo.mintAmountB;

      [tokenPriceA, tokenPriceB] = [
        tokenPriceById.get(mintA),
        tokenPriceById.get(mintB),
      ];

      if (lpMint && lpDecimals) {
        tokenPriceSources.push(
          ...getLpTokenSource({
            networkId: NetworkId.solana,
            sourceId: lpMint.toString(),
            platformId,
            priceUnderlyings: true,
            lpDetails: {
              address: lpMint.toString(),
              decimals: lpDecimals,
              supply: lpSupply.toNumber(),
            },
            poolUnderlyings: [
              {
                address: mintA,
                decimals: decimalsA,
                reserveAmount: tokenAmountA,
                tokenPrice: tokenPriceA,
                weight: 0.5,
              },
              {
                address: mintB,
                decimals: decimalsB,
                reserveAmount: tokenAmountB,
                tokenPrice: tokenPriceB,
                weight: 0.5,
              },
            ],
          })
        );
      } else {
        tokenPriceSources.push(
          ...getLpUnderlyingTokenSource({
            networkId: NetworkId.solana,
            sourceId: poolInfo.id,
            platformId,
            poolUnderlyings: [
              {
                address: mintA,
                decimals: decimalsA,
                reserveAmount: tokenAmountA,
                tokenPrice: tokenPriceA,
                weight: 0.5,
              },
              {
                address: mintB,
                decimals: decimalsB,
                reserveAmount: tokenAmountB,
                tokenPrice: tokenPriceB,
                weight: 0.5,
              },
            ],
          })
        );
      }
    }
    await cache.setTokenPriceSources(tokenPriceSources);
    page += 1;
  } while (subPools.hasNextPage && minimumLiquidity.isLessThan(lastLiquidity));
};

const job: Job = {
  id: `${platformId}-lp-tokens-api`,
  executor,
  label: 'normal',
};
export default job;
