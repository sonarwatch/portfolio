import BigNumber from 'bignumber.js';
import { NetworkId, parseTypeString } from '@sonarwatch/portfolio-core';
import { getClientAptos } from '../../../utils/clients';
import { Cache } from '../../../Cache';
import { Job, JobExecutor } from '../../../Job';
import { lpCoinInfoTypePrefix, programAddress } from './constants';
import {
  CoinInfoData,
  MoveResource,
  getAccountResources,
} from '../../../utils/aptos';
import { platformId } from '../constants';
import { TokenPairMetadataData } from './types';
import getLpTokenSourceRawOld from '../../../utils/misc/getLpTokenSourceRawOld';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, programAddress);
  if (!resources) return;

  const resourcesByType: Map<string, MoveResource<unknown>> = new Map();
  resources.forEach((resource) => {
    resourcesByType.set(resource.type, resource);
  });

  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    if (!resource.type.startsWith(lpCoinInfoTypePrefix)) continue;

    const parsedType = parseTypeString(resource.type);
    const lpType = parsedType.keys?.at(0)?.type;
    if (!lpType) continue;
    const lpInfoData = resource.data as CoinInfoData;
    const lpSupplyString = lpInfoData.supply?.vec[0]?.integer.vec[0]?.value;
    if (!lpSupplyString) continue;
    const lpDecimals = lpInfoData.decimals;
    const lpSupply = new BigNumber(lpSupplyString);
    if (lpSupply.isZero()) continue;

    const parsedLpType = parseTypeString(lpType);
    const typeX = parsedLpType.keys?.at(0)?.type;
    const typeY = parsedLpType.keys?.at(1)?.type;
    if (!typeX || !typeY) continue;

    const tokenPairResource = resourcesByType.get(
      `${programAddress}::swap::TokenPairMetadata<${typeX}, ${typeY}>`
    ) as MoveResource<TokenPairMetadataData> | undefined;
    if (!tokenPairResource) continue;
    const tokenPairData = tokenPairResource.data;
    if (tokenPairData.balance_x.value === '0') continue;
    if (tokenPairData.balance_y.value === '0') continue;

    const [tokenPriceX, tokenPriceY] = await cache.getTokenPrices(
      [typeX, typeY],
      NetworkId.aptos
    );
    if (!tokenPriceX || !tokenPriceY) continue;

    const source = getLpTokenSourceRawOld(
      NetworkId.aptos,
      platformId,
      platformId,
      {
        address: lpType,
        decimals: lpDecimals,
        supplyRaw: lpSupply,
      },
      [
        {
          address: typeX,
          decimals: tokenPairData.token_x_details.decimals,
          price: tokenPriceX.price,
          reserveAmountRaw: new BigNumber(tokenPairData.balance_x.value),
        },
        {
          address: typeY,
          decimals: tokenPairData.token_y_details.decimals,
          price: tokenPriceY.price,
          reserveAmountRaw: new BigNumber(tokenPairData.balance_y.value),
        },
      ],
      undefined
    );
    await cache.setTokenPriceSource(source);
  }
};

const job: Job = {
  id: `${platformId}-aptos-pools`,
  networkIds: [NetworkId.aptos],
  executor,
  labels: ['normal', NetworkId.aptos],
};
export default job;
