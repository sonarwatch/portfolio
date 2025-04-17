import BigNumber from 'bignumber.js';
import {
  NetworkId,
  TokenPriceSource,
  formatTokenAddress,
  parseTypeString,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lpCoinInfoTypePrefix, platformId, programAddress } from './constants';
import { PancakeSwapTokenPairMetadataData as TokenPairMetadataData } from './types';
import { getClientAptos } from '../../utils/clients';
import {
  CoinInfoData,
  MoveResource,
  getAccountResources,
} from '../../utils/aptos';
import getLpUnderlyingTokenSourceOld from '../../utils/misc/getLpUnderlyingTokenSourceOld';
import getLpTokenSourceRawOld from '../../utils/misc/getLpTokenSourceRawOld';
import { getDecimals } from '../../utils/aptos/getDecimals';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, programAddress);
  if (!resources) return;

  const resourcesByType: Map<string, MoveResource<unknown>> = new Map();
  resources.forEach((resource) => {
    resourcesByType.set(resource.type, resource);
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    resources
      .map((ressource) => {
        const { keys } = parseTypeString(ressource.type);
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

    const tokenPairId = parseTypeString(lpType)
      .keys?.map((t) => t.type)
      .join(', ');
    if (!tokenPairId) continue;

    // TODO : get ride of those by using parseTypeString() instead of getNestedType()
    if (
      tokenPairId.includes('swap::LPToken') ||
      tokenPairId.includes('LPCoinV1::LPCoin') ||
      tokenPairId.includes('lp_coin::LP')
    )
      continue;
    const typeX = parseTypeString(lpType).keys?.at(0)?.type;
    const typeY = parseTypeString(lpType).keys?.at(1)?.type;
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
      tokenPriceById.get(formatTokenAddress(typeX, NetworkId.aptos)),
      tokenPriceById.get(formatTokenAddress(typeY, NetworkId.aptos)),
    ];

    const [decimalsX, decimalsY] = await Promise.all([
      getDecimals(client, typeX),
      getDecimals(client, typeY),
    ]);
    const [reserveAmountRawX, reserveAmountRawY] = [
      new BigNumber(tokenPairData.balance_x.value),
      new BigNumber(tokenPairData.balance_y.value),
    ];

    if (!decimalsX || !decimalsY) continue;

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
  labels: ['normal', NetworkId.aptos],
};
export default job;
