import { NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { PoolInfoV1, PoolInfoV2 } from './types';
import { getClientCosmWasm } from '../../utils/clients';
import { infoQueryMsg, poolQueryMsg } from '../../utils/sei';

export type TokensInfosGetter = (
  minter: string
) => Promise<TokensInfos | undefined>;

export type TokensInfos = {
  mintX: string;
  mintY: string;
  amountX: BigNumber;
  amountY: BigNumber;
};

export async function getTokensInfosV2(
  minter: string
): Promise<TokensInfos | undefined> {
  const cosmWasmClient = await getClientCosmWasm(NetworkId.sei);

  const minterLpInfo = (await cosmWasmClient.queryContractSmart(
    minter,
    infoQueryMsg
  )) as PoolInfoV2;
  if (!minterLpInfo) return undefined;
  if (!minterLpInfo.token1_denom || !minterLpInfo.token2_denom)
    return undefined;

  const tokensMints = [];
  for (const name in minterLpInfo.token1_denom) {
    if (minterLpInfo.token1_denom[name])
      tokensMints.push(minterLpInfo.token1_denom[name]);
  }
  for (const name in minterLpInfo.token2_denom) {
    if (minterLpInfo.token2_denom[name])
      tokensMints.push(minterLpInfo.token2_denom[name]);
  }
  if (tokensMints.length !== 2) return undefined;

  const amountTokenX = new BigNumber(minterLpInfo.token1_reserve);
  const amountTokenY = new BigNumber(minterLpInfo.token2_reserve);

  if (amountTokenX.isZero() || amountTokenY.isZero()) return undefined;

  return {
    mintX: tokensMints[0],
    amountX: amountTokenX,
    mintY: tokensMints[1],
    amountY: amountTokenY,
  };
}

export async function getTokensInfosV1(
  minter: string
): Promise<TokensInfos | undefined> {
  const cosmWasmClient = await getClientCosmWasm(NetworkId.sei);

  const minterLpInfo = (await cosmWasmClient.queryContractSmart(
    minter,
    poolQueryMsg
  )) as PoolInfoV1;
  if (!minterLpInfo) return undefined;
  if (minterLpInfo.assets.length !== 2) return undefined;

  const tokensMints: string[] = [];
  for (let i = 0; i < minterLpInfo.assets.length; i += 1) {
    const { info } = minterLpInfo.assets[i];
    for (const nativeOrNot in info) {
      if (Object.prototype.hasOwnProperty.call(info, nativeOrNot)) {
        if (!info[nativeOrNot]) return undefined;
        const tokeInfo = info[nativeOrNot];
        for (const name in tokeInfo) {
          if (tokeInfo[name]) tokensMints.push(tokeInfo[name]);
        }
      }
    }
  }
  if (tokensMints.length !== 2) return undefined;

  const amountTokenX = new BigNumber(minterLpInfo.assets[0].amount);
  const amountTokenY = new BigNumber(minterLpInfo.assets[1].amount);

  if (amountTokenX.isZero() || amountTokenY.isZero()) return undefined;

  return {
    mintX: tokensMints[0],
    amountX: amountTokenX,
    mintY: tokensMints[1],
    amountY: amountTokenY,
  };
}
