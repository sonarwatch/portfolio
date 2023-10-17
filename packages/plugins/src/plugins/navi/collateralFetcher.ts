import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  apyToApr,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { getObjectFields } from '@mysten/sui.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  indexFactor,
  platformId,
  poolsInfos,
  rateFactor,
  reservesKey,
  reservesPrefix,
} from './constants';
import { getClientSui } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { Balance, ReserveData } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];

  const reservesData = await cache.getItem<ReserveData[]>(reservesKey, {
    prefix: reservesPrefix,
    networkId: NetworkId.sui,
  });
  if (!reservesData) return [];

  const reserveById: Map<string, ReserveData> = new Map();
  for (const reserve of reservesData) {
    reserveById.set(reserve.id.id, reserve);
  }

  for (const pool of poolsInfos) {
    const reserve = reserveById.get(pool.reserveData);
    if (!reserve) continue;
    const reserveData = reserve.value.fields;

    const borrowBalance = await client.getDynamicFieldObject({
      parentId: pool.borrowBalanceParentId,
      name: { type: 'address', value: owner },
    });

    const supplyBalance = await client.getDynamicFieldObject({
      parentId: pool.supplyBalanceParentId,
      name: { type: 'address', value: owner },
    });

    const tokenPrice = await cache.getTokenPrice(pool.type, NetworkId.sui);
    if (!tokenPrice) continue;

    if (!borrowBalance.error && borrowBalance.data) {
      const borrowInfo = getObjectFields(borrowBalance.data) as Balance;
      if (borrowInfo.value) {
        borrowedAssets.push(
          tokenPriceToAssetToken(
            tokenPrice.address,
            new BigNumber(borrowInfo.value)
              .dividedBy(reserveData.current_borrow_index)
              .multipliedBy(10 ** indexFactor)
              .toNumber(),
            NetworkId.sui,
            tokenPrice
          )
        );
        const apy = new BigNumber(reserveData.current_borrow_rate)
          .dividedBy(10 ** rateFactor)
          .toNumber();
        borrowedYields.push([
          {
            apr: apyToApr(apy),
            apy,
          },
        ]);
      }
    }

    if (!supplyBalance.error && supplyBalance.data) {
      const supplyInfo = getObjectFields(supplyBalance.data) as Balance;
      if (supplyInfo.value) {
        suppliedAssets.push(
          tokenPriceToAssetToken(
            tokenPrice.address,
            new BigNumber(supplyInfo.value)
              .dividedBy(reserveData.current_supply_index)
              .multipliedBy(10 ** indexFactor)
              .toNumber(),
            NetworkId.sui,
            tokenPrice
          )
        );
        const apy = new BigNumber(reserveData.current_supply_rate)
          .dividedBy(10 ** rateFactor)
          .toNumber();
        suppliedYields.push([
          {
            apr: apyToApr(apy),
            apy,
          },
        ]);
      }
    }
  }

  if (suppliedAssets.length === 0 && borrowedAssets.length === 0) return [];

  const { borrowedValue, collateralRatio, suppliedValue, value } =
    getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);
  const element: PortfolioElement = {
    type: PortfolioElementType.borrowlend,
    networkId: NetworkId.sui,
    platformId,
    label: 'Lending',
    value,
    data: {
      borrowedAssets,
      borrowedValue,
      borrowedYields,
      suppliedAssets,
      suppliedValue,
      suppliedYields,
      collateralRatio,
      rewardAssets,
      value,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${platformId}-collateral`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
