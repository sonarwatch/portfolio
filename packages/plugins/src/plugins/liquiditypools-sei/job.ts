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
import computeAndStoreLpPrice, {
  PoolData,
} from '../../utils/misc/computeAndStoreLpPrice';
import isAContract from '../../utils/sei/isAContract';

const executor: JobExecutor = async (cache: Cache) => {
  const cosmWasmClient = await getCosmWasmClient(getUrlEndpoint(NetworkId.sei));

  const pushedContractsByPlatform: Map<string, string[]> = new Map();
  for (const liquidityPoolInfo of liquidityPoolsInfos) {
    const { codes } = liquidityPoolInfo;
    const contracts: string[] = [];
    const platform = liquidityPoolInfo.platformId;
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

      const poolData: PoolData = {
        id: lpContract,
        lpDecimals: lpTokenInfo.decimals,
        mintTokenX: poolInfo.mintX,
        mintTokenY: poolInfo.mintY,
        reserveTokenX: poolInfo.amountX,
        reserveTokenY: poolInfo.amountY,
        supply,
      };

      await computeAndStoreLpPrice(cache, poolData, NetworkId.sei, platform);

      if (pushedContractsByPlatform.get(platform)) {
        const pushedContracts = pushedContractsByPlatform.get(platform);
        if (!pushedContracts) continue;
        pushedContractsByPlatform.set(platform, [
          ...pushedContracts,
          lpContract,
        ]);
      } else {
        pushedContractsByPlatform.set(platform, [lpContract]);
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
};
export default job;
