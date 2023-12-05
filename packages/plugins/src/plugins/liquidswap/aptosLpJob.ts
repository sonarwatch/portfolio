import BigNumber from 'bignumber.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { LiquidswapLiquidityPoolData as LiquidityPoolData } from './types';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  CoinInfoData,
  MoveResource,
  getAccountResources,
  getCoinAddressFromCoinType,
  getNestedType,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { lpCoinInfoTypePrefix, platformId, programAddress } from './constants';
import computeAndStoreLpPrice, {
  PoolData,
} from '../../utils/misc/computeAndStoreLpPrice';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, programAddress);
  if (!resources) return;

  const resourcesByType: Map<string, MoveResource<unknown>> = new Map();
  const lpsCoinInfo: MoveResource<CoinInfoData>[] = [];
  resources.forEach((resource) => {
    if (resource.type.startsWith(lpCoinInfoTypePrefix)) {
      const lpCoinInfo = resource as MoveResource<CoinInfoData>;
      const supply = lpCoinInfo.data.supply?.vec[0]?.integer.vec[0]?.value;
      if (supply && supply !== '0') lpsCoinInfo.push(lpCoinInfo);
      return;
    }
    resourcesByType.set(resource.type, resource);
  });
  const promises = [];
  for (let i = 0; i < lpsCoinInfo.length; i++) {
    const lpInfoResource = lpsCoinInfo[i];

    const lpType = getNestedType(lpInfoResource.type);
    const lpSupplyString =
      lpInfoResource.data.supply?.vec[0]?.integer.vec[0]?.value;
    if (!lpInfoResource) continue;
    if (!lpSupplyString) continue;
    const lpDecimals = lpInfoResource.data.decimals;

    const lpSupply = new BigNumber(lpSupplyString);
    if (lpSupply.isZero()) continue;

    const liquidityPoolId = getNestedType(lpType);
    const splits = liquidityPoolId.split(', ');
    const typeX = splits.at(0);
    const typeY = splits.at(1);
    const poolType = splits.at(2);
    if (!typeX) throw new Error(`Failed to get typeX: ${lpType}`);
    if (!typeY) throw new Error(`Failed to get typeY: ${lpType}`);
    if (!poolType) throw new Error(`Failed to get pool type: ${lpType}`);

    const creatorAddress = getCoinAddressFromCoinType(poolType);
    const liquidityPoolType = `${creatorAddress}::liquidity_pool::LiquidityPool<${liquidityPoolId}>`;
    const liquidityPoolResource = resourcesByType.get(liquidityPoolType) as
      | MoveResource<LiquidityPoolData>
      | undefined;
    if (!liquidityPoolResource) continue;

    const liquidityPoolData = liquidityPoolResource.data;
    if (
      liquidityPoolData.coin_x_reserve.value === '0' &&
      liquidityPoolData.coin_y_reserve.value === '0'
    )
      continue;

    const poolData: PoolData = {
      id: lpType,
      lpDecimals,
      supply: lpSupply,
      mintTokenX: typeX,
      mintTokenY: typeY,
      reserveTokenX: new BigNumber(liquidityPoolData.coin_x_reserve.value),
      reserveTokenY: new BigNumber(liquidityPoolData.coin_y_reserve.value),
    };
    promises.push(
      computeAndStoreLpPrice(cache, poolData, NetworkId.aptos, platformId)
    );
  }
  await Promise.allSettled(promises);
};

const job: Job = {
  id: `${platformId}-aptos-lp`,
  executor,
};
export default job;
