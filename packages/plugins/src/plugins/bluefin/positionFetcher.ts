import {
  getElementLendingValues,
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { perpetualsKey, platformId } from './constants';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getClientSui } from '../../utils/clients';
import { PerpetualV2, UserPosition } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import { ObjectResponse } from '../../utils/sui/types';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { usdcSuiType } from '../../utils/sui/constants';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const elements: PortfolioElement[] = [];

  let perpetuals = await cache.getItem<ObjectResponse<PerpetualV2>[]>(
    perpetualsKey,
    {
      prefix: platformId,
      networkId: NetworkId.sui,
    }
  );
  const tokenPrice = await cache.getTokenPrice(usdcSuiType, NetworkId.sui);

  if (!perpetuals || !tokenPrice) return elements;

  const positions = await Promise.all(
    perpetuals.map(
      (perp) =>
        perp.data?.content?.fields.positions.fields.id.id &&
        getDynamicFieldObject<UserPosition>(client, {
          parentId: perp.data?.content?.fields.positions.fields.id.id,
          name: {
            type: 'address',
            value: owner,
          },
        })
    )
  );

  // force refresh of Perpetuals to get fresh priceOracle
  perpetuals = await multiGetObjects<PerpetualV2>(
    client,
    positions
      .map((p) => p && p.data?.content?.fields?.value?.fields.perpID)
      .filter((p): p is string => p !== undefined)
  );
  const perpetualsAsMap: Map<string, PerpetualV2> = new Map();
  perpetuals.forEach((p) => {
    if (p && p.data?.objectId && p.data?.content?.fields)
      perpetualsAsMap.set(p.data.objectId, p.data?.content?.fields);
  });

  positions.forEach((position) => {
    if (position && position.error) return;
    if (!position || !position.data?.content?.fields?.value?.fields.qPos)
      return;

    const perp = perpetualsAsMap.get(
      position.data?.content?.fields?.value?.fields.perpID
    );
    if (!perp) return;

    const borrowedAssets: PortfolioAsset[] = [];
    const borrowedYields: Yield[][] = [];
    const suppliedAssets: PortfolioAsset[] = [];
    const suppliedYields: Yield[][] = [];
    const rewardAssets: PortfolioAsset[] = [];

    // Amount of margin/USDC user has locked into position.
    const margin = new BigNumber(
      position.data?.content?.fields?.value?.fields.margin
    );

    // position size in perp currency
    const qPos = new BigNumber(
      position.data?.content?.fields?.value?.fields.qPos
    ).dividedBy(10 ** 9);

    // total cost of opening position in USDC
    const oiOpen = new BigNumber(
      position.data?.content?.fields?.value?.fields.oiOpen
    );

    const leverage = oiOpen.dividedBy(margin);

    const oraclePrice = new BigNumber(perp.priceOracle).dividedBy(10 ** 9);

    const positionSizeUsd = qPos.multipliedBy(oraclePrice);

    const avgEntryPrice = qPos.isGreaterThan(0)
      ? oiOpen.dividedBy(qPos).dividedBy(10 ** 9)
      : new BigNumber(0);

    let pnl;
    if (position.data?.content?.fields?.value?.fields.isPosPositive) {
      pnl = qPos.multipliedBy(oraclePrice.minus(avgEntryPrice));
    } else {
      pnl = qPos.multipliedBy(avgEntryPrice.minus(oraclePrice));
    }

    if (positionSizeUsd.isPositive())
      suppliedAssets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          positionSizeUsd.toNumber(),
          NetworkId.sui,
          tokenPrice
        )
      );

    if (positionSizeUsd.times(leverage).isPositive())
      borrowedAssets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          positionSizeUsd.times(leverage).toNumber(),
          NetworkId.sui,
          tokenPrice
        )
      );

    if (!pnl.isZero())
      rewardAssets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          pnl.toNumber(),
          NetworkId.sui,
          tokenPrice
        )
      );

    const { borrowedValue, suppliedValue, healthRatio, rewardValue } =
      getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);

    const value = positionSizeUsd.plus(pnl).toNumber();
    const side = position.data?.content?.fields?.value?.fields.isPosPositive
      ? 'Long'
      : 'Short';

    /* console.log('margin', margin.toNumber());
    console.log('positionSize (SEI)', qPos.toNumber());
    console.log('positionSize (USD)', positionSizeUsd.toNumber());
    console.log('avgEntryPrice', avgEntryPrice.toNumber(), oraclePrice);
    console.log('side', side);
    console.log('leverage', leverage.toNumber());
    console.log('pnl', pnl.toNumber()); */

    if (suppliedAssets.length > 0 || borrowedAssets.length > 0)
      elements.push({
        type: PortfolioElementType.borrowlend,
        networkId: NetworkId.sui,
        platformId,
        label: 'Leverage',
        value,
        name: `${perp.name} ${side} ${leverage.decimalPlaces(2)}x`,
        data: {
          borrowedAssets,
          borrowedValue,
          borrowedYields,
          suppliedAssets,
          suppliedValue,
          suppliedYields,
          collateralRatio: null,
          rewardAssets,
          rewardValue,
          healthRatio,
          value,
        },
      });
  });

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-position`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
