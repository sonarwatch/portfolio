import BigNumber from 'bignumber.js';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { LiquidswapLiquidityPoolData as LiquidityPoolData } from './types';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  CoinInfoData,
  MoveResource,
  coinDecimals,
  getAccountResources,
  getCoinAddressFromCoinType,
  getNestedType,
} from '../../utils/aptos';
import { getClientAptos } from '../../utils/clients';
import { lpCoinInfoTypePrefix, platformId, programAddress } from './constants';
import getSourceWeight from '../../utils/misc/getSourceWeight';
import { walletTokensPlatform } from '../../platforms';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientAptos();
  const resources = await getAccountResources(client, programAddress);
  if (!resources) return;

  const resourcesByType: Map<string, MoveResource<unknown>> = new Map();
  const lpsCoinInfo: MoveResource<CoinInfoData>[] = [];
  resources.forEach((resource) => {
    if (resource.type.startsWith(lpCoinInfoTypePrefix)) {
      const lpCoinInfo = resource as MoveResource<CoinInfoData>;
      const supply = lpCoinInfo.data.supply?.vec[0]?.integer.vec[0]?.value;
      if (supply && supply !== '0') lpsCoinInfo.push(lpCoinInfo);
      return;
    }
    resourcesByType.set(resource.type, resource);
  });

  for (let i = 0; i < lpsCoinInfo.length; i++) {
    const lpInfoResource = lpsCoinInfo[i];

    const lpType = getNestedType(lpInfoResource.type);
    const lpSupplyString =
      lpInfoResource.data.supply?.vec[0]?.integer.vec[0]?.value;
    if (!lpInfoResource) continue;
    if (!lpSupplyString) continue;
    const lpDecimals = lpInfoResource.data.decimals;

    const lpSupply = new BigNumber(lpSupplyString)
      .div(10 ** lpDecimals)
      .toNumber();

    const liquidityPoolId = getNestedType(lpType);
    const splits = liquidityPoolId.split(', ');
    const typeX = splits.at(0);
    const typeY = splits.at(1);
    const poolType = splits.at(2);
    if (!typeX) throw new Error(`Failed to get typeX: ${lpType}`);
    if (!typeY) throw new Error(`Failed to get typeY: ${lpType}`);
    if (!poolType) throw new Error(`Failed to get pool type: ${lpType}`);

    const creatorAddress = getCoinAddressFromCoinType(poolType);
    const liquidityPoolType = `${creatorAddress}::liquidity_pool::LiquidityPool<${liquidityPoolId}>`;
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

    const tokenPrices = await cache.getTokenPrices(
      [typeX, typeY],
      NetworkId.aptos
    );
    const tokenPriceX = tokenPrices[0];
    const tokenPriceY = tokenPrices[1];

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

        reserveAmountX = new BigNumber(
          liquidityPoolData.coin_x_reserve.value
        ).div(10 ** decimalsX);
        reserveAmountY = new BigNumber(
          liquidityPoolData.coin_y_reserve.value
        ).div(10 ** decimalsY);
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
          id: `${platformId}-${liquidityPoolId}`,
          weight: getSourceWeight(
            reserveAmountY.multipliedBy(priceY).multipliedBy(2)
          ),
          address: typeX,
          networkId: NetworkId.aptos,
          platformId: walletTokensPlatform.id,
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
        reserveAmountX = new BigNumber(
          liquidityPoolData.coin_x_reserve.value
        ).div(10 ** decimalsX);
        reserveAmountY = new BigNumber(
          liquidityPoolData.coin_y_reserve.value
        ).div(10 ** decimalsY);
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
          id: `${platformId}-${liquidityPoolId}`,
          weight: getSourceWeight(
            reserveAmountX.multipliedBy(priceX).multipliedBy(2)
          ),
          address: typeY,
          networkId: NetworkId.aptos,
          platformId: walletTokensPlatform.id,
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
      reserveAmountX = new BigNumber(
        liquidityPoolData.coin_x_reserve.value
      ).div(10 ** decimalsX);
      reserveAmountY = new BigNumber(
        liquidityPoolData.coin_y_reserve.value
      ).div(10 ** decimalsY);
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
