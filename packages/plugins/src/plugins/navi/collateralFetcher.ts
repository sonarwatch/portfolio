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
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getAvailableRewards } from './getAvailableRewards';

const amountFactor = new BigNumber(10 ** 36);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const rewardAssets: PortfolioAsset[] = [];
  const suppliedLtvs: number[] = [];

  const reservesData = await cache.getItem<ReserveData[]>(reservesKey, {
    prefix: reservesPrefix,
    networkId: NetworkId.sui,
  });
  if (!reservesData) return [];

  const [tokenPrices, rewards] = await Promise.all([
    cache.getTokenPricesAsMap(
      reservesData.map((r) => r.value.fields.coin_type),
      NetworkId.sui
    ),
    getAvailableRewards(client, owner),
  ]);

  for (const rData of reservesData) {
    const borrowBalancePromise = getDynamicFieldObject<BalanceData>(client, {
      parentId:
        rData.value.fields.borrow_balance.fields.user_state.fields.id.id,
      name: { type: 'address', value: owner },
    });
    const supplyBalancePromise = getDynamicFieldObject<BalanceData>(client, {
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

    if (!borrowBalance.error && borrowBalance.data?.content) {
      const borrowInfo = borrowBalance.data.content?.fields;
      if (borrowInfo.value) {
        const borrowAsset = tokenPriceToAssetToken(
          rData.value.fields.coin_type,
          new BigNumber(borrowInfo.value)
            .times(rData.value.fields.current_borrow_index)
            .dividedBy(amountFactor)
            .toNumber(),
          NetworkId.sui,
          tokenPrice
        );
        if (borrowAsset.value === null || borrowAsset.value > 0.002) {
          borrowedAssets.push(borrowAsset);
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
    }

    if (!supplyBalance.error && supplyBalance.data?.content?.fields) {
      const supplyInfo = supplyBalance.data.content.fields;
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
        suppliedLtvs.push(
          new BigNumber(rData.value.fields.liquidation_factors.fields.threshold)
            .div(10 ** 27)
            .toNumber()
        );
      }
    }
  }

  if (rewards.size > 0) {
    rewards.forEach((amount, coinType) => {
      const tokenPrice = tokenPrices.get(
        formatTokenAddress(coinType, NetworkId.sui)
      );

      if (tokenPrice) {
        rewardAssets.push(
          tokenPriceToAssetToken(
            coinType,
            new BigNumber(amount)
              .dividedBy(10 ** tokenPrice.decimals)
              .toNumber(),
            NetworkId.sui,
            tokenPrice
          )
        );
      }
    });
  }

  if (
    suppliedAssets.length === 0 &&
    borrowedAssets.length === 0 &&
    rewardAssets.length === 0
  )
    return [];

  const { borrowedValue, suppliedValue, value, healthRatio, rewardValue } =
    getElementLendingValues(
      suppliedAssets,
      borrowedAssets,
      rewardAssets,
      suppliedLtvs
    );
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
      rewardValue,
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
