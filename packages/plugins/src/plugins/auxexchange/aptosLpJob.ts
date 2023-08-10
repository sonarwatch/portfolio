import BigNumber from 'bignumber.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  CoinInfoData,
  MoveResource,
  getAccountResources,
  getNestedType,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { lpCoinInfoTypePrefix, platformId, programAddress } from './constants';
import addLpAndTokensPricesSource, { PoolData } from '../liquidswap/helpers';

type PoolReserves = {
  x_reserve: { value: string };
  y_reserve: { value: string };
};

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, programAddress);
  if (!resources) return;

  const resourcesByType: Map<string, MoveResource<unknown>> = new Map();
  resources.forEach((resource) => {
    resourcesByType.set(resource.type, resource);
  });

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    if (!resource.type.startsWith(lpCoinInfoTypePrefix)) continue;

    const lpType = getNestedType(resource.type);
    const lpInfoData = resource.data as CoinInfoData;
    const lpSupplyString = lpInfoData.supply?.vec[0]?.integer.vec[0]?.value;
    if (!lpSupplyString) continue;

    const lpDecimals = lpInfoData.decimals;
    const lpSupply = new BigNumber(lpSupplyString)
      .div(10 ** lpDecimals)
      .toNumber();
    if (lpSupply === 0) continue;

    const poolId = getNestedType(lpType);
    const splits = poolId.split(', ');
    const typeX = splits.at(0);
    const typeY = splits.at(1);
    const poolResource = resourcesByType.get(
      `${programAddress}::amm::Pool<${poolId}>`
    ) as MoveResource<PoolReserves> | undefined;

    if (!poolResource) throw new Error(`Failed to get poolResource: ${lpType}`);
    if (!typeX) throw new Error(`Failed to get typeX: ${lpType}`);
    if (!typeY) throw new Error(`Failed to get typeY: ${lpType}`);
    const tokenPairData = poolResource.data;

    const poolData: PoolData = {
      id: `${platformId}-${lpType}`,
      supply: new BigNumber(lpSupply),
      lpDecimals,
      reserveTokenX: new BigNumber(tokenPairData.x_reserve.value),
      reserveTokenY: new BigNumber(tokenPairData.y_reserve.value),
    };

    await addLpAndTokensPricesSource(
      cache,
      [typeX, typeY],
      poolData,
      NetworkId.aptos,
      platformId
    );

    // const tokenPrices = await cache.getTokenPrices(
    //   [typeX, typeY],
    //   NetworkId.aptos
    // );
    // const tokenPriceX = tokenPrices[0];
    // const tokenPriceY = tokenPrices[1];
    // if (!tokenPriceX || !tokenPriceY) continue;

    // const reserveAmountX = new BigNumber(tokenPairData.x_reserve.value)
    //   .div(10 ** tokenPriceX.decimals)
    //   .toNumber();
    // const reserveAmountY = new BigNumber(tokenPairData.y_reserve.value)
    //   .div(10 ** tokenPriceY.decimals)
    //   .toNumber();
    // const reserveValueX = reserveAmountX * tokenPriceX.price;
    // const reserveValueY = reserveAmountY * tokenPriceY.price;
    // const price = (reserveValueX + reserveValueY) / lpSupply;

    // const amountPerLpX = reserveAmountX / lpSupply;
    // const amountPerLpY = reserveAmountY / lpSupply;
  }
};

const job: Job = {
  id: `${platformId}-aptos-lp`,
  executor,
};
export default job;
