import { getCosmWasmClient } from '@sei-js/core';
import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getUrlEndpoint } from '../../utils/clients/constants';
import {
  lpsCodeByPlatform,
  lpsContractsPrefix,
  lpsNamesByPlatform,
} from './constants';
import {
  MinterInfo,
  PoolInfo,
  TokenInfo,
  infoQueryMsg,
  minterQueryMsg,
  tokenInfoQueryMsg,
} from '../../utils/sei';
import computeAndStoreLpPrice, {
  PoolData,
} from '../../utils/misc/computeAndStoreLpPrice';

const executor: JobExecutor = async (cache: Cache) => {
  const cosmWasmClient = await getCosmWasmClient(getUrlEndpoint(NetworkId.sei));

  const contractsByPlatform: Map<string, string[]> = new Map();
  for (const platform of lpsCodeByPlatform.keys()) {
    const codes = lpsCodeByPlatform.get(platform);
    if (!codes) continue;

    const contracts: string[] = [];
    for (let i = 0; i < codes.length; i++) {
      const codesContracts = await cosmWasmClient.getContracts(codes[i]);
      contracts.push(...codesContracts);
    }
    contractsByPlatform.set(platform, contracts);
    await cache.setItem(
      `${platform}`,
      { id: platform, contracts },
      {
        prefix: lpsContractsPrefix,
        networkId: NetworkId.sei,
      }
    );
  }

  for (const platform of lpsCodeByPlatform.keys()) {
    const contracts = contractsByPlatform.get(platform);
    if (!contracts) continue;
    const namesFilter = lpsNamesByPlatform.get(platform);
    for (const lpContract of contracts) {
      const lpTokenInfo = (await cosmWasmClient.queryContractSmart(
        lpContract,
        tokenInfoQueryMsg
      )) as TokenInfo;
      if (!lpTokenInfo || new BigNumber(lpTokenInfo.total_supply).isZero())
        continue;
      if (namesFilter && !namesFilter.includes(lpTokenInfo.name)) continue;

      const minter = (await cosmWasmClient.queryContractSmart(
        lpContract,
        minterQueryMsg
      )) as MinterInfo;
      if (!minter || !minter.minter) continue;

      const minterLpInfo = (await cosmWasmClient.queryContractSmart(
        minter.minter,
        infoQueryMsg
      )) as PoolInfo;
      if (!minterLpInfo) continue;

      if (!minterLpInfo.token1_denom || !minterLpInfo.token2_denom) continue;

      const tokensNames = [];
      for (const name in minterLpInfo.token1_denom) {
        if (minterLpInfo.token1_denom[name])
          tokensNames.push(minterLpInfo.token1_denom[name]);
      }
      for (const name in minterLpInfo.token2_denom) {
        if (minterLpInfo.token2_denom[name])
          tokensNames.push(minterLpInfo.token2_denom[name]);
      }
      if (tokensNames.length !== 2) continue;

      if (
        new BigNumber(minterLpInfo.token1_reserve).isZero() ||
        new BigNumber(minterLpInfo.token2_reserve).isZero()
      )
        continue;

      const poolData: PoolData = {
        id: lpContract,
        lpDecimals: lpTokenInfo.decimals,
        mintTokenX: tokensNames[0],
        mintTokenY: tokensNames[1],
        reserveTokenX: new BigNumber(minterLpInfo.token1_reserve),
        reserveTokenY: new BigNumber(minterLpInfo.token2_reserve),
        supply: new BigNumber(minterLpInfo.lp_token_supply),
      };
      await computeAndStoreLpPrice(cache, poolData, NetworkId.sei, platform);
    }
  }
};

const job: Job = {
  id: 'liquidityPools-sei',
  executor,
};
export default job;
