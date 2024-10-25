import { NetworkId, apyToApr } from '@sonarwatch/portfolio-core';
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
import { BalanceData, ReserveData } from './types';
import { getDynamicFieldObject } from '../../utils/sui/getDynamicFieldObject';
import { getAvailableRewards } from './getAvailableRewards';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const amountFactor = new BigNumber(10 ** 36);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const reservesData = await cache.getItem<ReserveData[]>(reservesKey, {
    prefix: reservesPrefix,
    networkId: NetworkId.sui,
  });
  if (!reservesData) return [];

  const [rewards] = await Promise.all([getAvailableRewards(client, owner)]);

  const elementRegistry = new ElementRegistry(NetworkId.sui, platformId);
  const element = elementRegistry.addElementBorrowlend({ label: 'Lending' });

  for (const rData of reservesData) {
    const [borrowBalance, supplyBalance] = await Promise.all([
      getDynamicFieldObject<BalanceData>(client, {
        parentId:
          rData.value.fields.borrow_balance.fields.user_state.fields.id.id,
        name: { type: 'address', value: owner },
      }),
      getDynamicFieldObject<BalanceData>(client, {
        parentId:
          rData.value.fields.supply_balance.fields.user_state.fields.id.id,
        name: { type: 'address', value: owner },
      }),
    ]);

    if (!borrowBalance.error && borrowBalance.data?.content) {
      const borrowInfo = borrowBalance.data.content?.fields;
      if (borrowInfo.value) {
        const amount = new BigNumber(borrowInfo.value)
          .times(rData.value.fields.current_borrow_index)
          .dividedBy(amountFactor);
        if (amount.isGreaterThan(0.002)) {
          element.addBorrowedAsset({
            address: rData.value.fields.coin_type,
            amount: new BigNumber(borrowInfo.value)
              .times(rData.value.fields.current_borrow_index)
              .dividedBy(amountFactor),
            alreadyShifted: true,
          });

          const apy = new BigNumber(rData.value.fields.current_borrow_rate)
            .dividedBy(10 ** rateFactor)
            .toNumber();

          element.addBorrowedYield([
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
        const amount = new BigNumber(supplyInfo.value)
          .times(rData.value.fields.current_supply_index)
          .dividedBy(amountFactor);

        if (amount.isGreaterThan(0.002)) {
          element.addSuppliedAsset({
            address: rData.value.fields.coin_type,
            amount,
            alreadyShifted: true,
          });
          const apy = new BigNumber(rData.value.fields.current_supply_rate)
            .dividedBy(10 ** rateFactor)
            .toNumber();
          element.addSuppliedYield([
            {
              apr: apyToApr(apy),
              apy,
            },
          ]);
          element.addSuppliedLtv(
            new BigNumber(
              rData.value.fields.liquidation_factors.fields.threshold
            )
              .div(10 ** 27)
              .toNumber()
          );
        }
      }
    }
  }

  if (rewards.size > 0) {
    rewards.forEach((amount, coinType) => {
      if (amount > 0.002) {
        element.addRewardAsset({
          address: coinType,
          amount,
        });
      }
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-collateral`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
