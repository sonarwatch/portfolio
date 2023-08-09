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
  coinDecimals,
  getAccountResources,
  getNestedType,
} from '../../utils/aptos';
import getSourceWeight from '../../utils/misc/getSourceWeight';

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

    const lpType = getNestedType(resource.type);
    const lpInfoData = resource.data as CoinInfoData;
    const lpSupplyString = lpInfoData.supply?.vec[0]?.integer.vec[0]?.value;
    if (!lpSupplyString) continue;

    const lpDecimals = lpInfoData.decimals;
    const lpSupply = new BigNumber(lpSupplyString)
      .div(10 ** lpDecimals)
      .toNumber();
    if (lpSupply === 0) continue;

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
    const tokenPrices = await cache.getTokenPrices(
      [typeX, typeY],
      NetworkId.aptos
    );
    const tokenPriceX = tokenPrices[0];
    const tokenPriceY = tokenPrices[1];
    if (!tokenPriceX && !tokenPriceY) continue;

    const tokenPairData = tokenPairResource.data;
    if (
      tokenPairData.balance_x.value === '0' &&
      tokenPairData.balance_y.value === '0'
    )
      continue;

    let decimalsX: number;
    let decimalsY: number;
    let priceX: number;
    let priceY: number;
    let reserveAmountX: BigNumber;
    let reserveAmountY: BigNumber;

    if (!tokenPriceX || !tokenPriceY) {
      let unknownTokenDecimals: number[];

      if (!tokenPriceX && tokenPriceY) {
        unknownTokenDecimals = (await client.view({
          function: coinDecimals,
          type_arguments: [typeX],
          arguments: [],
        })) as number[];
        if (unknownTokenDecimals.length !== 1) continue;

        [decimalsX] = unknownTokenDecimals;
        decimalsY = tokenPriceY.decimals;

        reserveAmountX = new BigNumber(tokenPairData.balance_x.value).div(
          10 ** decimalsX
        );
        reserveAmountY = new BigNumber(tokenPairData.balance_y.value).div(
          10 ** decimalsY
        );
        priceY = tokenPriceY.price;
        if (
          reserveAmountY.multipliedBy(priceY).multipliedBy(2).isLessThan(10000)
        )
          continue;
        priceX = reserveAmountY
          .multipliedBy(priceY)
          .dividedBy(reserveAmountX)
          .toNumber();
        await cache.setTokenPriceSource({
          id: `${platformId}-${tokenPairId}`,
          weight: getSourceWeight(
            reserveAmountY.multipliedBy(priceY).multipliedBy(2)
          ),
          address: typeX,
          networkId: NetworkId.aptos,
          platformId,
          decimals: decimalsX,
          price: priceX,
          timestamp: Date.now(),
        });
      } else if (!tokenPriceY && tokenPriceX) {
        unknownTokenDecimals = (await client.view({
          function: coinDecimals,
          type_arguments: [typeY],
          arguments: [],
        })) as number[];
        if (unknownTokenDecimals.length !== 1) continue;

        decimalsX = tokenPriceX.decimals;
        [decimalsY] = unknownTokenDecimals;
        reserveAmountX = new BigNumber(tokenPairData.balance_x.value).div(
          10 ** decimalsX
        );
        reserveAmountY = new BigNumber(tokenPairData.balance_y.value).div(
          10 ** decimalsY
        );
        priceX = tokenPriceX.price;
        if (
          reserveAmountX.multipliedBy(priceX).multipliedBy(2).isLessThan(10000)
        )
          continue;
        priceY = reserveAmountX
          .multipliedBy(priceX)
          .dividedBy(reserveAmountY)
          .toNumber();
        await cache.setTokenPriceSource({
          id: `${platformId}-${tokenPairId}`,
          weight: getSourceWeight(
            reserveAmountX.multipliedBy(priceX).multipliedBy(2)
          ),
          address: typeY,
          networkId: NetworkId.aptos,
          platformId,
          decimals: decimalsY,
          price: priceY,
          timestamp: Date.now(),
        });
      } else {
        continue;
      }
    } else {
      decimalsX = tokenPriceX.decimals;
      decimalsY = tokenPriceY.decimals;
      priceX = tokenPriceX.price;
      priceY = tokenPriceY.price;
      reserveAmountX = new BigNumber(tokenPairData.balance_x.value).div(
        10 ** decimalsX
      );
      reserveAmountY = new BigNumber(tokenPairData.balance_y.value).div(
        10 ** decimalsY
      );
    }
    const reserveValueX = reserveAmountX.multipliedBy(priceX);
    const reserveValueY = reserveAmountY.multipliedBy(priceY);
    const price = reserveValueX
      .plus(reserveValueY)
      .dividedBy(lpSupply)
      .toNumber();
    const amountPerLpX = reserveAmountX.dividedBy(lpSupply).toNumber();
    const amountPerLpY = reserveAmountY.dividedBy(lpSupply).toNumber();

    await cache.setTokenPriceSource({
      id: platformId,
      weight: 1,
      address: lpType,
      networkId: NetworkId.aptos,
      platformId,
      decimals: lpDecimals,
      price,
      underlyings: [
        {
          networkId: NetworkId.aptos,
          address: typeX,
          decimals: decimalsX,
          price: priceX,
          amountPerLp: amountPerLpX,
        },
        {
          networkId: NetworkId.aptos,
          address: typeY,
          decimals: decimalsY,
          price: priceY,
          amountPerLp: amountPerLpY,
        },
      ],
      timestamp: Date.now(),
    });
  }
};

const job: Job = {
  id: `${platformId}-aptos-lp`,
  executor,
};
export default job;
