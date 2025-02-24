import { LeverageSide, NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { abexMarketCacheKey, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSui } from '../../utils/clients';
import {
  calculatePNL,
  getPositionCapInfoList,
  getPositionInfoList,
} from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { IMarketInfo } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const positionCapInfoList = await getPositionCapInfoList(client, owner);

  if (positionCapInfoList.length === 0) return [];

  const marketInfo = await cache.getItem<IMarketInfo>(abexMarketCacheKey, {
    prefix: platformId,
    networkId: NetworkId.sui,
  });

  if (!marketInfo) return [];

  const positionInfoList = await getPositionInfoList(
    client,
    positionCapInfoList,
    marketInfo,
    cache,
    owner
  );

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);

  for (const positionInfo of positionInfoList) {
    if (positionInfo.closed) continue;
    const element = elementRegistry.addElementLeverage({
      label: 'Leverage',
    });

    const tokenPrices = await cache.getTokenPricesAsMap(
      [positionInfo.indexToken, positionInfo.collateralToken],
      NetworkId.sui
    );

    const tokenPriceIndex = tokenPrices.get(positionInfo.indexToken);
    const tokenPriceCollateral = tokenPrices.get(positionInfo.collateralToken);

    if (!tokenPriceCollateral) continue;

    let pnlValue;
    let leverage;

    if (tokenPriceIndex) {
      const calcPnl = await calculatePNL(
        positionInfo,
        tokenPriceIndex,
        tokenPriceCollateral
      );

      if (calcPnl) {
        pnlValue = new BigNumber(calcPnl.pnlValue);
        leverage = calcPnl.leverage;
      }
    }

    element.addIsoPosition({
      address: positionInfo.indexToken,
      collateralValue: new BigNumber(positionInfo.collateralAmount)
        .multipliedBy(tokenPriceCollateral.price)
        .dividedBy(10 ** tokenPriceCollateral.decimals)
        .toNumber(),
      side: positionInfo.long ? LeverageSide.long : LeverageSide.short,
      sizeValue: positionInfo.positionSize,
      pnlValue: pnlValue?.toNumber() || null,
      leverage,
      markPrice: tokenPriceCollateral.price,
      size: positionInfo.positionSize / tokenPriceCollateral.price,
      entryPrice: null,
      liquidationPrice: null,
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
