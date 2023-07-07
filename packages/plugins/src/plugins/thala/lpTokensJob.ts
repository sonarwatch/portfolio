import {
  Cache,
  Job,
  JobExecutor,
  NetworkId,
  TokenPriceUnderlying,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  lpStableCoinInfoTypePrefix,
  lpStableTypePrefix,
  lpStableTypeTokenPrefix,
  lpWeightedCoinInfoTypePrefix,
  lpWeightedTypePrefix,
  lpWeightedTypeTokenPrefix,
  platformId,
  programAddressLP,
} from './constants';
import {
  CoinInfoData,
  MoveResource,
  getAccountResources,
  getNestedType,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { ThalaTokenPairMetadataData as TokenPairMetadataData } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientAptos();
  const resources = await getAccountResources(connection, programAddressLP);
  if (!resources) return;
  const resourcesByType: Map<string, MoveResource<unknown>> = new Map();
  resources.forEach((resource) => {
    resourcesByType.set(resource.type, resource);
  });
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];

    if (
      !(
        resource.type.startsWith(lpStableCoinInfoTypePrefix) ||
        resource.type.startsWith(lpWeightedCoinInfoTypePrefix)
      )
    )
      continue;
    const lpType = getNestedType(resource.type);
    const lpInfoData = resource.data as CoinInfoData;
    const lpSupplyString = lpInfoData.supply?.vec[0]?.integer.vec[0]?.value;
    if (!lpSupplyString) continue;
    const lpDecimals = lpInfoData.decimals;
    const lpSupply = new BigNumber(lpSupplyString)
      .div(10 ** lpDecimals)
      .toNumber();
    if (lpSupply === 0) continue;

    // get LP tokens full composition <token,token,token,token,token_weight,token_weight,token_weight,token_weight>
    const lpTokenComposition = getNestedType(lpType);
    const tokensAndWeights = lpTokenComposition.split(', ');

    // find the first NULL token to know how many tokens are active for the pool
    const numberOfActiveTokens =
      tokensAndWeights.indexOf(
        '0x48271d39d0b05bd6efca2278f22277d6fcc375504f9839fd73f74ace240861af::base_pool::Null'
      ) + 1;

    let tokenPairResource: MoveResource<TokenPairMetadataData> | undefined;

    if (lpType.includes(lpStableTypePrefix)) {
      tokenPairResource = resourcesByType.get(
        `${lpStableTypeTokenPrefix}${lpTokenComposition}>`
      ) as MoveResource<TokenPairMetadataData> | undefined;
    } else if (lpType.includes(lpWeightedTypePrefix)) {
      tokenPairResource = resourcesByType.get(
        `${lpWeightedTypeTokenPrefix}${lpTokenComposition}>`
      ) as MoveResource<TokenPairMetadataData> | undefined;
    }
    if (!tokenPairResource) continue;

    const tokensValues = getTokensValuesArray(tokenPairResource.data);
    const underlyings: TokenPriceUnderlying[] = [];
    let totalReserveValue = 0;
    for (let index = 0; index < numberOfActiveTokens - 1; index++) {
      const token = tokensAndWeights?.at(index);
      if (!token) continue;

      const tokenAmount = tokensValues[index];
      if (tokenAmount.isZero()) continue;

      const tokenPrice = await cache.getTokenPrice(token, NetworkId.aptos);
      if (!tokenPrice || tokenPrice === undefined) continue;

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

    if (totalReserveValue === 0) continue;
    const price = totalReserveValue / lpSupply;
    await cache.setTokenPriceSource({
      id: platformId,
      weight: 1,
      address: lpType.substring(0, lpType.length - 1),
      networkId: NetworkId.aptos,
      isBase: false,
      decimals: lpDecimals,
      price,
      underlyings,
      timestamp: Date.now(),
    });
  }
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
  executor,
};
export default job;
