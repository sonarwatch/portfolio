import BigNumber from 'bignumber.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lpCoinInfoTypePrefix, platformId, programAddress } from './constants';
import { PancakeSwapTokenPairMetadataData as TokenPairMetadataData } from './types';
import { getClientAptos } from '../../utils/clients';
import {
  CoinInfoData,
  MoveResource,
  getAccountResources,
  getNestedType,
  parseTypeString,
} from '../../utils/aptos';
import getTokenPricesMap from '../../utils/misc/getTokensPricesMap';
import getLpUnderlyingTokenSource from '../../utils/misc/getLpUnderlyingTokenSource';
import { getDecimalsForToken } from '../../utils/misc/getDecimalsForToken';
import getLpTokenSourceRaw from '../../utils/misc/getLpTokenSourceRaw';

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
      .map((ressource) => {
        const { keys } = parseTypeString(ressource.type);
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

    const tokenPairId = getNestedType(lpType);

    // TODO : get ride of those by using parseTypeString() instead of getNestedType()
    if (
      tokenPairId.includes('swap::LPToken') ||
      tokenPairId.includes('LPCoinV1::LPCoin') ||
      tokenPairId.includes('lp_coin::LP')
    )
      continue;
    const splits = tokenPairId.split(', ');
    const typeX = splits.at(0);
    const typeY = splits.at(1);
    const tokenPairResource = resourcesByType.get(
      `${programAddress}::swap::TokenPairMetadata<${tokenPairId}>`
    ) as MoveResource<TokenPairMetadataData> | undefined;

    if (!tokenPairResource)
      throw new Error(`Failed to get tokenPairResource: ${lpType}`);
    if (!typeX) throw new Error(`Failed to get typeX: ${typeX}`);
    if (!typeY) throw new Error(`Failed to get typeY: ${typeY}`);
    if (typeX.includes('TestToken') || typeY.includes('TestToken')) continue;

    const tokenPairData = tokenPairResource.data;
    if (
      tokenPairData.balance_x.value === '0' &&
      tokenPairData.balance_y.value === '0'
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
      new BigNumber(tokenPairData.balance_x.value),
      new BigNumber(tokenPairData.balance_y.value),
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
