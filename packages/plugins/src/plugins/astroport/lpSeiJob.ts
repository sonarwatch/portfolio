import { getCosmWasmClient } from '@sei-js/core';
import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lpTokensCode, platformId } from './constants';
import { getUrlEndpoint } from '../../utils/clients/constants';
import {
  minterQueryMsg,
  poolQueryMsg,
  tokenInfoQueryMsg,
} from '../../utils/sei';
import { MinterInfo, TokenInfo } from '../seaswap/types';
import setLpPriceSource, { PoolData } from '../../utils/misc/setLpPriceSource';
import { PoolInfo } from './types';

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

    const minter = (await cosmWasmClient.queryContractSmart(
      lpContract,
      JSON.parse(minterQueryMsg)
    )) as MinterInfo;
    if (!minter || !minter.minter) continue;

    const minterLpInfo = (await cosmWasmClient.queryContractSmart(
      minter.minter,
      JSON.parse(poolQueryMsg)
    )) as PoolInfo;
    if (!minterLpInfo) continue;
    if (minterLpInfo.assets.length !== 2) continue;

    const tokens = [];
    for (let i = 0; i < minterLpInfo.assets.length; i += 1) {
      const { info } = minterLpInfo.assets[i];
      for (const nativeOrNot in info) {
        if (!info[nativeOrNot]) continue;
        const tokeInfo = info[nativeOrNot];
        for (const name in tokeInfo) {
          if (tokeInfo[name]) tokens.push(tokeInfo[name]);
        }
      }
    }
    if (tokens.length !== 2) continue;

    const amountTokenX = new BigNumber(minterLpInfo.assets[0].amount);
    const amountTokenY = new BigNumber(minterLpInfo.assets[1].amount);

    if (amountTokenX.isZero() || amountTokenY.isZero()) continue;

    const poolData: PoolData = {
      id: lpContract,
      lpDecimals: lpTokenInfo.decimals,
      mintTokenX: tokens[0],
      mintTokenY: tokens[1],
      reserveTokenX: amountTokenX,
      reserveTokenY: amountTokenY,
      supply: new BigNumber(minterLpInfo.total_share),
    };
    await setLpPriceSource(cache, poolData, NetworkId.sei, platformId);
  }
};

const job: Job = {
  id: `${platformId}-lp-sei`,
  executor,
};
export default job;
