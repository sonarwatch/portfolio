import BigNumber from 'bignumber.js';
import {
  NetworkId,
  TokenPriceSource,
  formatTokenAddress,
  parseTypeString,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  CoinInfoData,
  MoveResource,
  getAccountResources,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { lpCoinInfoTypePrefix, platformId, packageId } from './constants';
import { getCachedDecimalsForToken } from '../../utils/misc/getCachedDecimalsForToken';
import getLpUnderlyingTokenSourceOld from '../../utils/misc/getLpUnderlyingTokenSourceOld';
import getLpTokenSourceRawOld from '../../utils/misc/getLpTokenSourceRawOld';

type PoolReserves = {
  x_reserve: { value: string };
  y_reserve: { value: string };
};

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, packageId);
  if (!resources) return;

  const resourcesByType: Map<string, MoveResource<unknown>> = new Map();
  resources.forEach((resource) => {
    resourcesByType.set(resource.type, resource);
  });

  const tokenPrices = await cache.getTokenPricesAsMap(
    resources
      .map((resource) => {
        const { keys } = parseTypeString(resource.type);
        return keys ? keys.map((key) => key.type) : [];
      })
      .flat(),
    NetworkId.aptos
  );

  const lpSources: TokenPriceSource[] = [];
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    if (!resource.type.startsWith(lpCoinInfoTypePrefix)) continue;

    const lpType = parseTypeString(resource.type).keys?.at(0)?.type;
    if (!lpType) continue;

    const lpInfoData = resource.data as CoinInfoData;
    const lpSupplyString = lpInfoData.supply?.vec[0]?.integer.vec[0]?.value;
    if (!lpSupplyString) continue;

    const lpDecimals = lpInfoData.decimals;
    const lpSupply = new BigNumber(lpSupplyString);
    if (lpSupply.isZero()) continue;

    const parsedLpType = parseTypeString(lpType);
    const poolId = parsedLpType.keys?.map((t) => t.type).join(', ');
    const typeX = parsedLpType.keys?.at(0)?.type;
    const typeY = parsedLpType.keys?.at(1)?.type;
    if (!typeX || !typeY || !poolId) continue;

    const poolResource = resourcesByType.get(
      `${packageId}::amm::Pool<${poolId}>`
    ) as MoveResource<PoolReserves> | undefined;

    if (!poolResource) throw new Error(`Failed to get poolResource: ${lpType}`);
    const tokenPairData = poolResource.data;

    const [tokenPriceX, tokenPriceY] = [
      tokenPrices.get(formatTokenAddress(typeX, NetworkId.aptos)),
      tokenPrices.get(formatTokenAddress(typeY, NetworkId.aptos)),
    ];

    const [decimalsX, decimalsY] = await Promise.all([
      getCachedDecimalsForToken(cache, typeX, NetworkId.aptos),
      getCachedDecimalsForToken(cache, typeY, NetworkId.aptos),
    ]);
    if (!decimalsX || !decimalsY) continue;

    const [reserveAmountRawX, reserveAmountRawY] = [
      new BigNumber(tokenPairData.x_reserve.value),
      new BigNumber(tokenPairData.y_reserve.value),
    ];
    const underlyingSource = getLpUnderlyingTokenSourceOld(
      lpType,
      NetworkId.aptos,
      {
        address: typeX,
        decimals: decimalsX,
        reserveAmountRaw: reserveAmountRawX,
        tokenPrice: tokenPriceX,
        weight: 0.5,
      },
      {
        address: typeY,
        decimals: decimalsY,
        reserveAmountRaw: reserveAmountRawY,
        tokenPrice: tokenPriceY,
        weight: 0.5,
      }
    );
    if (underlyingSource) lpSources.push(underlyingSource);

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
      ''
    );
    lpSources.push(lpSource);
  }
  await cache.setTokenPriceSources(lpSources);
};

const job: Job = {
  id: `${platformId}-aptos-lp`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal',NetworkId.aptos],
};
export default job;
