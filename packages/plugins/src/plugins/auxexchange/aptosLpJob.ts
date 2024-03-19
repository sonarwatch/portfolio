import BigNumber from 'bignumber.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  CoinInfoData,
  MoveResource,
  getAccountResources,
  getNestedType,
  parseTypeString,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { lpCoinInfoTypePrefix, platformId, programAddress } from './constants';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import { getDecimalsForToken } from '../../utils/misc/getDecimalsForToken';
import getLpUnderlyingTokenSource from '../../utils/misc/getLpUnderlyingTokenSource';
import getLpTokenSourceRaw from '../../utils/misc/getLpTokenSourceRaw';

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

  const tokenPriceById = await getTokenPricesMap(
    resources
      .map((resource) => {
        const { keys } = parseTypeString(resource.type);
        return keys ? keys.map((key) => key.type) : [];
      })
      .flat(),
    NetworkId.aptos,
    cache
  );

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    if (!resource.type.startsWith(lpCoinInfoTypePrefix)) continue;

    const lpType = getNestedType(resource.type);
    const lpInfoData = resource.data as CoinInfoData;
    const lpSupplyString = lpInfoData.supply?.vec[0]?.integer.vec[0]?.value;
    if (!lpSupplyString) continue;

    const lpDecimals = lpInfoData.decimals;
    const lpSupply = new BigNumber(lpSupplyString);
    if (lpSupply.isZero()) continue;

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

    const [tokenPriceX, tokenPriceY] = [
      tokenPriceById.get(typeX),
      tokenPriceById.get(typeY),
    ];

    const [decimalsX, decimalsY] = await Promise.all([
      getDecimalsForToken(cache, typeX, NetworkId.aptos),
      getDecimalsForToken(cache, typeY, NetworkId.aptos),
    ]);

    const [reserveAmountRawX, reserveAmountRawY] = [
      new BigNumber(tokenPairData.x_reserve.value),
      new BigNumber(tokenPairData.y_reserve.value),
    ];

    if (!decimalsX || !decimalsY) continue;

    const underlyingSource = getLpUnderlyingTokenSource(
      lpType,
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
    await cache.setTokenPriceSource(lpSource);
  }
};

const job: Job = {
  id: `${platformId}-aptos-lp`,
  executor,
  label: 'normal',
};
export default job;
