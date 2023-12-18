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
  parseTypeString,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { lpCoinInfoTypePrefix, platformId, programAddress } from './constants';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import { getDecimalsForToken } from '../../utils/misc/getDecimalsForToken';
import getLpTokenSourceRaw from '../../utils/misc/getLpTokenSourceRaw';
import getLpUnderlyingTokenSource from '../../utils/misc/getLpUnderlyingTokenSource';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, programAddress);
  if (!resources) return;

  const resourcesByType: Map<string, MoveResource<unknown>> = new Map();
  const lpsCoinInfo: MoveResource<CoinInfoData>[] = [];
  const types: Set<string> = new Set();
  resources.forEach((resource) => {
    if (resource.type.startsWith(lpCoinInfoTypePrefix)) {
      const lpCoinInfo = resource as MoveResource<CoinInfoData>;
      const supply = lpCoinInfo.data.supply?.vec[0]?.integer.vec[0]?.value;
      const tempTypes = parseTypeString(resource.type);
      let { keys } = tempTypes;
      while (keys && keys[0].keys) {
        keys = keys[0].keys;
      }
      if (keys) keys.forEach((key) => types.add(key.type));
      if (supply && supply !== '0') lpsCoinInfo.push(lpCoinInfo);
      return;
    }
    resourcesByType.set(resource.type, resource);
  });

  const tokenPriceById = await getTokenPricesMap(
    Array.from(types),
    NetworkId.aptos,
    cache
  );

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

    const [tokenPriceX, tokenPriceY] = [
      tokenPriceById.get(typeX),
      tokenPriceById.get(typeY),
    ];
    const [decimalsX, decimalsY] = await Promise.all([
      getDecimalsForToken(cache, typeX, NetworkId.aptos),
      getDecimalsForToken(cache, typeY, NetworkId.aptos),
    ]);
    const [reserveAmountRawX, reserveAmountRawY] = [
      new BigNumber(liquidityPoolData.coin_x_reserve.value),
      new BigNumber(liquidityPoolData.coin_y_reserve.value),
    ];

    if (!decimalsX || !decimalsY) continue;

    const underlyingSource = getLpUnderlyingTokenSource(
      lpType,
      platformId,
      NetworkId.aptos,
      {
        address: typeX,
        decimals: decimalsX,
        reserveAmountRaw: reserveAmountRawX,
        tokenPrice: tokenPriceX,
      },
      {
        address: typeY,
        decimals: decimalsY,
        reserveAmountRaw: reserveAmountRawY,
        tokenPrice: tokenPriceY,
      }
    );
    if (underlyingSource) await cache.setTokenPriceSource(underlyingSource);

    if (!tokenPriceX || !tokenPriceY) continue;
    const lpSource = getLpTokenSourceRaw(
      NetworkId.aptos,
      lpType,
      platformId,
      '',
      {
        address: lpType,
        decimals: lpDecimals,
        supplyRaw: lpSupply,
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
  }
};

const job: Job = {
  id: `${platformId}-aptos-lp`,
  executor,
};
export default job;
