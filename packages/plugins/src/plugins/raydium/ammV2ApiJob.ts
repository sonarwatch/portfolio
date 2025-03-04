import { NetworkId } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { walletTokensPlatform } from '../tokens/constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { apiV3, platformId } from './constants';
import { ApiV3Response } from './types';
import { getLpTokenSource } from '../../utils/misc/getLpTokenSource';
import { minimumLiquidity } from '../../utils/misc/computeAndStoreLpPrice';
import { defaultAcceptedPairs } from '../../utils/misc/getLpUnderlyingTokenSource';
import getSourceWeight from '../../utils/misc/getSourceWeight';

const executor: JobExecutor = async (cache: Cache) => {
  let apiRes;
  let page = 1;
  let subPools;
  let tokenPriceById;
  let lastLiquidity;

  const acceptedPairs = defaultAcceptedPairs.get(NetworkId.solana);

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

      lpMint = poolInfo.lpMint?.address;
      lpDecimals = poolInfo.lpMint?.decimals;

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
            sourceId: poolInfo.id,
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
      } else if (acceptedPairs) {
        if (acceptedPairs.includes(mintB) && tokenPriceB) {
          tokenPriceSources.push({
            id: poolInfo.id,
            weight: getSourceWeight(poolInfo.tvl),
            address: mintA,
            networkId: NetworkId.solana,
            platformId: walletTokensPlatform.id,
            decimals: decimalsA,
            price: new BigNumber(tokenPriceB.price)
              .multipliedBy(poolInfo.price)
              .toNumber(),
            timestamp: Date.now(),
          });
        } else if (acceptedPairs.includes(mintA) && tokenPriceA) {
          tokenPriceSources.push({
            id: poolInfo.id,
            weight: getSourceWeight(poolInfo.tvl),
            address: mintB,
            networkId: NetworkId.solana,
            platformId: walletTokensPlatform.id,
            decimals: decimalsB,
            price: new BigNumber(tokenPriceA.price)
              .dividedBy(poolInfo.price)
              .toNumber(),
            timestamp: Date.now(),
          });
        }
      }
    }
    await cache.setTokenPriceSources(tokenPriceSources);
    page += 1;
  } while (subPools.hasNextPage && minimumLiquidity.isLessThan(lastLiquidity));
};

const job: Job = {
  id: `${platformId}-lp-tokens-api`,
  executor,
  labels: ['normal'],
};
export default job;
