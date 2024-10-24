import {
  getUsdValueSum,
  NetworkId,
  PortfolioAsset,
  PortfolioAssetGeneric,
  PortfolioAssetType,
  PortfolioElement,
  PortfolioElementType,
  Yield,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { perpetualIdsKey, platformId } from './constants';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getClientSui } from '../../utils/clients';
import { PerpetualV2, UserPosition } from './types';
import { multiGetObjects } from '../../utils/sui/multiGetObjects';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { wUsdcSuiType } from '../../utils/sui/constants';
import { usdcLogoUri } from '../../utils/misc/constants';

const perpsTtl = 20000;
const perps: Map<string, PerpetualV2> = new Map();
let lastPerpsUpdate = 0;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  // Refresh perps map
  if (lastPerpsUpdate < Date.now() - perpsTtl) {
    const perpIds = await cache.getItem<string[]>(perpetualIdsKey, {
      prefix: platformId,
      networkId: NetworkId.sui,
    });
    if (perpIds) {
      const perpetualsRes = await multiGetObjects<PerpetualV2>(client, perpIds);
      perpetualsRes.forEach((p) => {
        if (p.data?.objectId && p.data?.content?.fields)
          perps.set(p.data.objectId, p.data?.content?.fields);
      });
    }
    lastPerpsUpdate = Date.now();
  }

  const positions = await Promise.all(
    Array.from(perps.values()).map((perp) =>
      getDynamicFieldObject<UserPosition>(client, {
        parentId: perp.positions.fields.id.id,
        name: {
          type: 'address',
          value: owner,
        },
      })
    )
  );

  const tokenPrice = await cache.getTokenPrice(wUsdcSuiType, NetworkId.sui);
  if (!tokenPrice) return [];

  const elements: PortfolioElement[] = [];
  positions.forEach((position) => {
    if (position && position.error) return;
    if (!position || !position.data?.content?.fields?.value?.fields.qPos)
      return;

    const perp = perps.get(
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

    const collatUsd = margin.dividedBy(10 ** 9);

    const avgEntryPrice = qPos.isGreaterThan(0)
      ? oiOpen.dividedBy(qPos).dividedBy(10 ** 9)
      : new BigNumber(0);

    let pnl;
    if (position.data?.content?.fields?.value?.fields.isPosPositive) {
      pnl = qPos.multipliedBy(oraclePrice.minus(avgEntryPrice));
    } else {
      pnl = qPos.multipliedBy(avgEntryPrice.minus(oraclePrice));
    }

    if (collatUsd.isPositive())
      suppliedAssets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          collatUsd.toNumber(),
          NetworkId.sui,
          tokenPrice
        )
      );

    if (collatUsd.times(leverage).isPositive())
      borrowedAssets.push(
        tokenPriceToAssetToken(
          tokenPrice.address,
          collatUsd.times(leverage).toNumber(),
          NetworkId.sui,
          tokenPrice
        )
      );

    const pnlAsset: PortfolioAssetGeneric = {
      type: PortfolioAssetType.generic,
      networkId: NetworkId.solana,
      value: pnl.toNumber(),
      imageUri: usdcLogoUri,
      attributes: {},
      name: 'PnL',
      data: {
        amount: pnl.toNumber(),
        price: 1,
      },
    };
    rewardAssets.push(pnlAsset);

    if (
      suppliedAssets.length === 0 &&
      borrowedAssets.length === 0 &&
      rewardAssets.length === 0
    )
      return;

    const value = margin
      .dividedBy(10 ** 9)
      .plus(pnl)
      .toNumber();

    if (value === 0) return;

    const side = position.data?.content?.fields?.value?.fields.isPosPositive
      ? 'Long'
      : 'Short';

    elements.push({
      type: PortfolioElementType.borrowlend,
      networkId: NetworkId.sui,
      platformId,
      label: 'Leverage',
      value,
      name: `${perp.name} ${side} ${leverage.decimalPlaces(2)}x`,
      data: {
        borrowedAssets,
        borrowedValue: getUsdValueSum(borrowedAssets.map((a) => a.value)),
        borrowedYields,
        suppliedAssets,
        suppliedValue: getUsdValueSum(suppliedAssets.map((a) => a.value)),
        suppliedYields,
        rewardAssets,
        rewardValue: getUsdValueSum(rewardAssets.map((a) => a.value)),
        healthRatio: null,
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
