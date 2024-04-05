import { NetworkId, TokenPriceUnderlying } from '@sonarwatch/portfolio-core';
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
  CoinInfoData,
  MoveResource,
  coinInfo,
  getAccountResources,
  parseTypeString,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { ThalaTokenPairMetadataData as TokenPairMetadataData } from './types';
import { tokenToLpType } from './helpers';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';

const executor: JobExecutor = async (cache: Cache) => {
  const connection = getClientAptos();
  const resources = await getAccountResources(connection, programAddressLP);
  if (!resources) return;

  const tokenResourcesByType: Map<string, MoveResource<unknown>> = new Map();
  resources.forEach((resource) => {
    if (
      resource.type.includes(lpStableTypePrefix) ||
      resource.type.includes(lpWeightedTypePrefix)
    )
      tokenResourcesByType.set(resource.type, resource);
  });

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const parseLpInfo = parseTypeString(resource.type);

    if (parseLpInfo.root !== coinInfo) continue;
    if (!parseLpInfo.keys) continue;

    const poolInfo = parseLpInfo.keys?.at(0);
    if (poolInfo === undefined) continue;

    if (
      poolInfo.root !== lpStableTypeTokenPrefix &&
      poolInfo.root !== lpWeightedTypeTokenPrefix
    ) {
      continue;
    }

    const lpInfoData = resource.data as CoinInfoData;
    const lpSupplyString = lpInfoData.supply?.vec[0]?.integer.vec[0]?.value;
    if (!lpSupplyString) continue;

    const lpDecimals = lpInfoData.decimals;
    const lpSupply = new BigNumber(lpSupplyString)
      .div(10 ** lpDecimals)
      .toNumber();
    if (lpSupply === 0) continue;

    const lpType = poolInfo.type;
    const lpTokenComposition = poolInfo.keys;
    if (!lpTokenComposition) continue;

    const tokenPairResource = tokenResourcesByType.get(
      tokenToLpType(lpType)
    ) as MoveResource<TokenPairMetadataData> | undefined;
    if (!tokenPairResource) continue;

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

      const tokenPrice = await cache.getTokenPrice(
        tokenAddress,
        NetworkId.aptos
      );
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
      address: poolInfo.type,
      networkId: NetworkId.aptos,
      platformId,
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
  label: 'normal',
};
export default job;
