import { getCosmWasmClient } from '@sei-js/core';
import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getUrlEndpoint } from '../../utils/clients/constants';
import { platformId, lpTokensCode, lpTokensNames } from './constants';
import { MinterInfo, PoolInfo, TokenInfo } from './types';
import setLpPriceSource, { PoolData } from '../../utils/misc/setLpPriceSource';
import {
  infoQueryMsg,
  minterQueryMsg,
  tokenInfoQueryMsg,
} from '../../utils/sei';

const executor: JobExecutor = async (cache: Cache) => {
  const cosmWasmClient = await getCosmWasmClient(getUrlEndpoint(NetworkId.sei));

  const lpContracts = await cosmWasmClient.getContracts(lpTokensCode);

  for (const lpContract of lpContracts) {
    const lpTokenInfo = (await cosmWasmClient.queryContractSmart(
      lpContract,
      JSON.parse(tokenInfoQueryMsg)
    )) as TokenInfo;
    if (!lpTokenInfo || new BigNumber(lpTokenInfo.total_supply).isZero())
      continue;
    if (lpTokenInfo.name !== lpTokensNames) continue;

    const minter = (await cosmWasmClient.queryContractSmart(
      lpContract,
      JSON.parse(minterQueryMsg)
    )) as MinterInfo;
    if (!minter || !minter.minter) continue;

    const minterLpInfo = (await cosmWasmClient.queryContractSmart(
      minter.minter,
      JSON.parse(infoQueryMsg)
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
    await setLpPriceSource(cache, poolData, NetworkId.sei, platformId);
  }
};

const job: Job = {
  id: `${platformId}-lp-sei`,
  executor,
};
export default job;
