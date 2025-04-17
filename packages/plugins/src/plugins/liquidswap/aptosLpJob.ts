import BigNumber from 'bignumber.js';
import {
  NetworkId,
  formatTokenAddress,
  parseTypeString,
} from '@sonarwatch/portfolio-core';
import {
  LiquidswapLiquidityPoolData as LiquidityPoolData,
  LpInfo,
} from './types';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  CoinInfoData,
  MoveResource,
  getAccountResources,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import {
  lpCoinInfoTypePrefix,
  platformId,
  programAddress,
  resourceAddress,
} from './constants';
import getLpTokenSourceRawOld from '../../utils/misc/getLpTokenSourceRawOld';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, programAddress);
  if (!resources) return;

  const resourcesByType: Map<string, MoveResource<unknown>> = new Map();
  const lpsCoinInfo: MoveResource<CoinInfoData>[] = [];
  const tokens: string[] = [];
  const lpInfos: LpInfo[] = [];
  resources.forEach((resource) => {
    if (resource.type.startsWith(lpCoinInfoTypePrefix)) {
      const lpCoinInfo = resource as MoveResource<CoinInfoData>;
      const supply = lpCoinInfo.data.supply?.vec[0]?.integer.vec[0]?.value;
      if (supply && supply !== '0') {
        const parsedType = parseTypeString(lpCoinInfo.type);
        const lpType = parsedType.keys?.at(0)?.type;
        if (!lpType) return;
        const parsedLpType = parseTypeString(lpType);
        const typeX = parsedLpType.keys?.at(0)?.type;
        const typeY = parsedLpType.keys?.at(1)?.type;
        const poolType = parsedLpType.keys?.at(2)?.type;

        if (!typeX || !typeY || !poolType) return;
        tokens.push(...[typeX, typeY]);
        lpInfos.push({
          lpType,
          poolType,
          typeX,
          typeY,
        });
        lpsCoinInfo.push(lpCoinInfo);
      }
      return;
    }
    resourcesByType.set(resource.type, resource);
  });

  const tokenPrices = await cache.getTokenPricesAsMap(tokens, NetworkId.aptos);
  const sources = [];
  for (let i = 0; i < lpsCoinInfo.length; i++) {
    const lpInfoResource = lpsCoinInfo[i];

    const { lpType, poolType, typeX, typeY } = lpInfos[i];
    if (!lpInfoResource) continue;
    const lpSupplyString =
      lpInfoResource.data.supply?.vec[0]?.integer.vec[0]?.value;
    if (!lpSupplyString) continue;
    const lpDecimals = lpInfoResource.data.decimals;

    const lpSupply = new BigNumber(lpSupplyString);
    if (lpSupply.isZero()) continue;

    const liquidityPoolType = `${resourceAddress}::liquidity_pool::LiquidityPool<${typeX}, ${typeY}, ${poolType}>`;
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
      tokenPrices.get(formatTokenAddress(typeX, NetworkId.aptos)),
      tokenPrices.get(formatTokenAddress(typeY, NetworkId.aptos)),
    ];
    const [reserveAmountRawX, reserveAmountRawY] = [
      new BigNumber(liquidityPoolData.coin_x_reserve.value),
      new BigNumber(liquidityPoolData.coin_y_reserve.value),
    ];

    if (!tokenPriceX || !tokenPriceY) continue;
    const lpSource = getLpTokenSourceRawOld(
      NetworkId.aptos,
      lpType,
      platformId,
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
      ],
      undefined
    );
    sources.push(lpSource);
  }
  await cache.setTokenPriceSources(sources);
};

const job: Job = {
  id: `${platformId}-aptos-lp`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal', NetworkId.aptos],
};
export default job;
