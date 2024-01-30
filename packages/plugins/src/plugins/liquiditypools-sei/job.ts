import { getCosmWasmClient } from '@sei-js/core';
import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getUrlEndpoint } from '../../utils/clients/constants';
import { liquidityPoolsInfos, pluginId } from './constants';
import {
  MinterInfo,
  TokenInfo,
  minterQueryMsg,
  tokenInfoQueryMsg,
} from '../../utils/sei';
import isAContract from '../../utils/sei/isAContract';
import { getDecimalsForToken } from '../../utils/misc/getDecimalsForToken';
import getLpUnderlyingTokenSource from '../../utils/misc/getLpUnderlyingTokenSource';
import getLpTokenSourceRaw from '../../utils/misc/getLpTokenSourceRaw';

const executor: JobExecutor = async (cache: Cache) => {
  const cosmWasmClient = await getCosmWasmClient(getUrlEndpoint(NetworkId.sei));

  const pushedContractsByPlatform: Map<string, string[]> = new Map();
  for (const liquidityPoolInfo of liquidityPoolsInfos) {
    const { codes } = liquidityPoolInfo;
    const contracts: string[] = [];
    const { platformId } = liquidityPoolInfo;
    for (let i = 0; i < codes.length; i++) {
      const codesContracts = await cosmWasmClient.getContracts(codes[i]);
      contracts.push(...codesContracts);
    }
    if (contracts.length === 0) continue;

    const namesFilter = liquidityPoolInfo.namesFilters;
    for (const lpContract of contracts) {
      const lpTokenInfo = (await cosmWasmClient.queryContractSmart(
        lpContract,
        tokenInfoQueryMsg
      )) as TokenInfo;
      if (!lpTokenInfo) continue;
      const supply = new BigNumber(lpTokenInfo.total_supply);
      if (supply.isZero()) continue;

      if (namesFilter && !namesFilter.includes(lpTokenInfo.name)) continue;

      const minter = (await cosmWasmClient.queryContractSmart(
        lpContract,
        minterQueryMsg
      )) as MinterInfo;
      if (!minter || !minter.minter) continue;

      if (!isAContract(minter.minter)) continue;

      const poolInfo = await liquidityPoolInfo.getter(minter.minter);
      if (!poolInfo) continue;

      const [tokenPriceX, tokenPriceY] = await cache.getTokenPrices(
        [poolInfo.mintX, poolInfo.mintY],
        NetworkId.sei
      );

      const [decimalsX, decimalsY] = await Promise.all([
        getDecimalsForToken(cache, poolInfo.mintX, NetworkId.sei),
        getDecimalsForToken(cache, poolInfo.mintY, NetworkId.sei),
      ]);

      const [reserveAmountRawX, reserveAmountRawY] = [
        new BigNumber(poolInfo.amountX),
        new BigNumber(poolInfo.amountY),
      ];

      if (!decimalsX || !decimalsY) continue;

      const underlyingSource = getLpUnderlyingTokenSource(
        lpContract,
        platformId,
        NetworkId.sei,
        {
          address: poolInfo.mintX,
          decimals: decimalsX,
          reserveAmountRaw: reserveAmountRawX,
          tokenPrice: tokenPriceX,
        },
        {
          address: poolInfo.mintY,
          decimals: decimalsY,
          reserveAmountRaw: reserveAmountRawY,
          tokenPrice: tokenPriceY,
        }
      );
      if (underlyingSource) await cache.setTokenPriceSource(underlyingSource);

      if (!tokenPriceX || !tokenPriceY) continue;
      const lpSource = getLpTokenSourceRaw(
        NetworkId.sei,
        lpContract,
        platformId,
        '',
        {
          address: lpContract,
          decimals: lpTokenInfo.decimals,
          supplyRaw: supply,
        },
        [
          {
            address: tokenPriceX.address,
            decimals: tokenPriceX.decimals,
            price: tokenPriceX.price,
            reserveAmountRaw: reserveAmountRawX,
          },
          {
            address: tokenPriceY.address,
            decimals: tokenPriceY.decimals,
            price: tokenPriceY.price,
            reserveAmountRaw: reserveAmountRawY,
          },
        ]
      );
      await cache.setTokenPriceSource(lpSource);

      if (pushedContractsByPlatform.get(platformId)) {
        const pushedContracts = pushedContractsByPlatform.get(platformId);
        if (!pushedContracts) continue;
        pushedContractsByPlatform.set(platformId, [
          ...pushedContracts,
          lpContract,
        ]);
      } else {
        pushedContractsByPlatform.set(platformId, [lpContract]);
      }
    }
  }

  for (const platform of pushedContractsByPlatform.keys()) {
    const contracts = pushedContractsByPlatform.get(platform);
    if (!contracts || contracts.length === 0) continue;
    await cache.setItem(
      platform,
      { id: platform, contracts },
      {
        prefix: pluginId,
        networkId: NetworkId.sei,
      }
    );
  }
};

const job: Job = {
  id: pluginId,
  executor,
  label: 'normal',
};
export default job;
