import {
  NetworkId,
  PortfolioAsset,
  PortfolioElement,
  PortfolioElementType,
  Yield,
  apyToApr,
  formatTokenAddress,
  getElementLendingValues,
} from '@sonarwatch/portfolio-core';
import { getObjectFields } from '@mysten/sui.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  platformId,
  rateFactor,
  reservesKey,
  reservesPrefix,
} from './constants';
import { getClientSui } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { BalanceData, ReserveData } from './types';

const amountFactor = new BigNumber(10 ** 36);

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

  const tokenPrices = await cache.getTokenPricesAsMap(
    reservesData.map((r) => r.value.fields.coin_type),
    NetworkId.sui
  );

  for (const rData of reservesData) {
    const borrowBalancePromise = client.getDynamicFieldObject({
      parentId:
        rData.value.fields.borrow_balance.fields.user_state.fields.id.id,
      name: { type: 'address', value: owner },
    });
    const supplyBalancePromise = client.getDynamicFieldObject({
      parentId:
        rData.value.fields.supply_balance.fields.user_state.fields.id.id,
      name: { type: 'address', value: owner },
    });
    const [borrowBalance, supplyBalance] = await Promise.all([
      borrowBalancePromise,
      supplyBalancePromise,
    ]);

    const tokenPrice = tokenPrices.get(
      formatTokenAddress(rData.value.fields.coin_type, NetworkId.sui)
    );

    if (!borrowBalance.error && borrowBalance.data) {
      const borrowInfo = getObjectFields(borrowBalance.data) as BalanceData;
      if (borrowInfo.value) {
        borrowedAssets.push(
          tokenPriceToAssetToken(
            rData.value.fields.coin_type,
            new BigNumber(borrowInfo.value)
              .times(rData.value.fields.current_borrow_index)
              .dividedBy(amountFactor)
              .toNumber(),
            NetworkId.sui,
            tokenPrice
          )
        );
        const apy = new BigNumber(rData.value.fields.current_borrow_rate)
          .dividedBy(10 ** rateFactor)
          .toNumber();
        borrowedYields.push([
          {
            apr: -apyToApr(apy),
            apy: -apy,
          },
        ]);
      }
    }

    if (!supplyBalance.error && supplyBalance.data) {
      const supplyInfo = getObjectFields(supplyBalance.data) as BalanceData;
      if (supplyInfo.value) {
        suppliedAssets.push(
          tokenPriceToAssetToken(
            rData.value.fields.coin_type,
            new BigNumber(supplyInfo.value)
              .times(rData.value.fields.current_supply_index)
              .dividedBy(amountFactor)
              .toNumber(),
            NetworkId.sui,
            tokenPrice
          )
        );
        const apy = new BigNumber(rData.value.fields.current_supply_rate)
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

  const { borrowedValue, suppliedValue, value, healthRatio } =
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
      collateralRatio: null,

      healthRatio,
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
