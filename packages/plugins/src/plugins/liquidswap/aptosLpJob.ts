import BigNumber from 'bignumber.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
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
  parseTypeString,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import {
  lpCoinInfoTypePrefix,
  platformId,
  programAddress,
  resourceAddress,
} from './constants';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import getLpTokenSourceRaw from '../../utils/misc/getLpTokenSourceRaw';
import runInBatch from '../../utils/misc/runInBatch';

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

  const tokenPriceById = await getTokenPricesMap(
    tokens,
    NetworkId.aptos,
    cache
  );
  // const decimalsByToken: Map<string, number> = new Map();
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
      tokenPriceById.get(typeX),
      tokenPriceById.get(typeY),
    ];
    const [reserveAmountRawX, reserveAmountRawY] = [
      new BigNumber(liquidityPoolData.coin_x_reserve.value),
      new BigNumber(liquidityPoolData.coin_y_reserve.value),
    ];

    // const cachedDecimalsX = decimalsByToken.get(typeX);
    // const cachedDecimalsY = decimalsByToken.get(typeY);

    // const decimalsX =
    //   cachedDecimalsX ||
    //   (await getDecimalsForToken(cache, typeX, NetworkId.aptos));
    // const decimalsY =
    //   cachedDecimalsY ||
    //   (await getDecimalsForToken(cache, typeY, NetworkId.aptos));

    // if (!decimalsX || !decimalsY) continue;
    // if (!cachedDecimalsX) decimalsByToken.set(typeX, decimalsX);
    // if (!cachedDecimalsY) decimalsByToken.set(typeY, decimalsY);

    // const underlyingSource = getLpUnderlyingTokenSource(
    //   lpType,
    //   platformId,
    //   NetworkId.aptos,
    //   {
    //     address: typeX,
    //     decimals: decimalsX,
    //     reserveAmountRaw: reserveAmountRawX,
    //     tokenPrice: tokenPriceX,
    //   },
    //   {
    //     address: typeY,
    //     decimals: decimalsY,
    //     reserveAmountRaw: reserveAmountRawY,
    //     tokenPrice: tokenPriceY,
    //   }
    // );
    // if (underlyingSource) sources.push(underlyingSource);

    if (!tokenPriceX || !tokenPriceY) continue;
    const lpSource = getLpTokenSourceRaw(
      NetworkId.aptos,
      lpType,
      platformId,
      undefined,
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
    sources.push(lpSource);
  }

  await runInBatch(
    sources.map(
      (tokenPriceSource) => () => cache.setTokenPriceSource(tokenPriceSource)
    ),
    50
  );
};

const job: Job = {
  id: `${platformId}-aptos-lp`,
  executor,
};
export default job;
