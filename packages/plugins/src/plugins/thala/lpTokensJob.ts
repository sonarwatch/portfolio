import {
  formatMoveTokenAddress,
  NetworkId,
  TokenPriceSource,
  TokenPriceUnderlying,
  parseTypeString,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  lpStableTypePrefix,
  lpStableTypeTokenPrefix,
  lpWeightedTypePrefix,
  lpWeightedTypeTokenPrefix,
  platformId,
  programAddressLP,
} from './constants';
import {
  coinInfo,
  CoinInfoData,
  getAccountResources,
  MoveResource,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { ThalaTokenPairMetadataData as TokenPairMetadataData } from './types';
import { tokenToLpType } from './helpers';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { arrayToMap } from '../../utils/misc/arrayToMap';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientAptos();
  const resources = await getAccountResources(
    connection,
    programAddressLP
  ).then((unfilteredResources) =>
    (unfilteredResources || []).filter((resource) => {
      if (!resource) return false;
      return !(
        !resource.type.includes(lpStableTypePrefix) &&
        !resource.type.includes(lpWeightedTypePrefix)
      );
    })
  );
  if (!resources) return;

  const tokenResourcesByType = arrayToMap(resources, 'type');

  const tokenAdresses = new Set<string>();

  resources.forEach((resource) => {
    const parseLpInfo = parseTypeString(resource.type);

    if (parseLpInfo.root !== coinInfo) return;
    if (!parseLpInfo.keys) return;

    const poolInfo = parseLpInfo.keys?.at(0);
    if (poolInfo === undefined) return;

    if (
      poolInfo.root !== lpStableTypeTokenPrefix &&
      poolInfo.root !== lpWeightedTypeTokenPrefix
    ) {
      return;
    }

    const lpTokenComposition = poolInfo.keys;
    if (!lpTokenComposition) return;

    for (let index = 0; index < lpTokenComposition.length; index++) {
      const token = lpTokenComposition.at(index);
      if (!token) continue;
      if (token.struct === 'Null') break;

      const tokenAddress = token.type;
      if (!tokenAddress) continue;

      tokenAdresses.add(tokenAddress);
    }
  });

  const tokenPrices = await cache.getTokenPricesAsMap(
    [...tokenAdresses],
    NetworkId.aptos
  );

  const tokenPriceSources: TokenPriceSource[] = [];

  resources.forEach((resource) => {
    const parseLpInfo = parseTypeString(resource.type);

    if (parseLpInfo.root !== coinInfo) return;
    if (!parseLpInfo.keys) return;

    const poolInfo = parseLpInfo.keys?.at(0);
    if (poolInfo === undefined) return;

    if (
      poolInfo.root !== lpStableTypeTokenPrefix &&
      poolInfo.root !== lpWeightedTypeTokenPrefix
    ) {
      return;
    }

    const lpInfoData = resource.data as CoinInfoData;
    const lpSupplyString = lpInfoData.supply?.vec[0]?.integer.vec[0]?.value;
    if (!lpSupplyString) return;

    const lpDecimals = lpInfoData.decimals;
    const lpSupply = new BigNumber(lpSupplyString)
      .div(10 ** lpDecimals)
      .toNumber();
    if (lpSupply === 0) return;

    const lpType = poolInfo.type;
    const lpTokenComposition = poolInfo.keys;
    if (!lpTokenComposition) return;

    const tokenPairResource = tokenResourcesByType.get(
      tokenToLpType(lpType)
    ) as MoveResource<TokenPairMetadataData> | undefined;
    if (!tokenPairResource) return;

    const tokensValues = getTokensValuesArray(tokenPairResource.data);
    const underlyings: TokenPriceUnderlying[] = [];
    let totalReserveValue = 0;
    for (let index = 0; index < lpTokenComposition.length; index++) {
      const token = lpTokenComposition.at(index);

      if (!token) continue;
      if (token.struct === 'Null') break;

      const tokenAddress = token.type;
      if (!tokenAddress) continue;

      const tokenAmount = tokensValues[index];
      if (!tokenAmount) continue;
      if (tokenAmount.isZero()) continue;

      const tokenPrice = tokenPrices.get(formatMoveTokenAddress(tokenAddress));
      if (!tokenPrice) continue;

      const reserveAmount = new BigNumber(tokenAmount)
        .div(10 ** tokenPrice.decimals)
        .toNumber();
      const reserveValue = reserveAmount * tokenPrice.price;
      totalReserveValue += reserveValue;

      underlyings.push({
        networkId: NetworkId.aptos,
        address: tokenPrice.address,
        decimals: tokenPrice.decimals,
        price: tokenPrice.price,
        amountPerLp: reserveAmount / lpSupply,
      });
    }

    if (totalReserveValue === 0) return;

    const price = totalReserveValue / lpSupply;

    tokenPriceSources.push({
      id: platformId,
      weight: 1,
      address: poolInfo.type,
      networkId: NetworkId.aptos,
      platformId,
      decimals: lpDecimals,
      price,
      underlyings,
      timestamp: Date.now(),
    });
  });

  await cache.setTokenPriceSources(tokenPriceSources);
};

function getTokensValuesArray(
  tokenPairMetadataData: TokenPairMetadataData
): [BigNumber, BigNumber, BigNumber, BigNumber] {
  return [
    new BigNumber(tokenPairMetadataData.asset_0.value),
    new BigNumber(tokenPairMetadataData.asset_1.value),
    new BigNumber(tokenPairMetadataData.asset_2.value),
    new BigNumber(tokenPairMetadataData.asset_3.value),
  ];
}

const job: Job = {
  id: `${platformId}-lp-tokens`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal', NetworkId.aptos],
};
export default job;
