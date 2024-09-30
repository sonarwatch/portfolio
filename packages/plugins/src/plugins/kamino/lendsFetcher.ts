import { NetworkId, aprToApy } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  elevationGroupsKey,
  lendingConfigs,
  marketsKey,
  platformId,
  reservesKey,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getClientSolana } from '../../utils/clients';
import { ElevationGroup, obligationStruct } from './structs/klend';
import { ReserveDataEnhanced } from './types';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import {
  getLendingPda,
  getLeveragePdas,
  getMultiplyPdas,
} from './helpers/pdas';
import { getCumulativeBorrowRate, sfToValue } from './helpers/common';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const zeroAdressValue = '11111111111111111111111111111111';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const networkId = NetworkId.solana;

  const [markets, elevationGroupsAccounts] = await Promise.all([
    cache.getItem<string[]>(marketsKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
    cache.getItem<ElevationGroup[]>(elevationGroupsKey, {
      prefix: platformId,
      networkId: NetworkId.solana,
    }),
  ]);

  if (!markets) return [];

  const elevationGroups: Map<number, ElevationGroup> = new Map();
  elevationGroupsAccounts?.forEach((group) =>
    elevationGroups.set(group.id, group)
  );

  const [lendingPdas, multiplyPdas] = markets
    ? [getLendingPda(owner, markets), getMultiplyPdas(owner, markets)]
    : [[], []];

  const leveragePdas = getLeveragePdas(owner);

  const obligations = await getParsedMultipleAccountsInfo(
    client,
    obligationStruct,
    [...lendingPdas, ...multiplyPdas, ...leveragePdas]
  );

  if (!obligations.some((obli) => obli !== null)) return [];

  const lendingAccounts = obligations.slice(0, lendingPdas.length);

  const multiplyAccounts = obligations.slice(
    lendingPdas.length,
    lendingPdas.length + multiplyPdas.length
  );

  const leverageAccounts = obligations.slice(
    lendingPdas.length + multiplyPdas.length,
    obligations.length
  );

  if (!lendingAccounts && !multiplyAccounts && !leverageAccounts) return [];

  const reserves = await cache.getItem<Record<string, ReserveDataEnhanced>>(
    reservesKey,
    {
      prefix: platformId,
      networkId,
    }
  );
  if (!reserves) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  // *************
  // KLend : https://app.kamino.finance/lending
  // *************

  if (lendingAccounts) {
    for (const lendingAccount of lendingAccounts) {
      if (!lendingAccount) continue;
      const lendingConfig = lendingConfigs.get(
        lendingAccount.lendingMarket.toString()
      );

      const element = elementRegistry.addElementBorrowlend({
        label: 'Lending',
        name: lendingConfig?.name,
      });

      for (const deposit of lendingAccount.deposits) {
        if (
          deposit.depositReserve.toString() === zeroAdressValue ||
          deposit.depositedAmount.isLessThanOrEqualTo(0)
        )
          continue;

        const amountRaw = deposit.depositedAmount;
        const reserve = reserves[deposit.depositReserve.toString()];
        if (!reserve) continue;

        element.addSuppliedAsset({
          address: reserve.liquidity.mintPubkey,
          amount: amountRaw
            .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
            .dividedBy(reserve.exchangeRate),
          alreadyShifted: true,
        });
        element.addSuppliedLtv(reserve.config.liquidationThresholdPct / 100);
        element.addSuppliedYield([
          { apr: reserve.supplyApr, apy: aprToApy(reserve.supplyApr) },
        ]);
      }

      for (const borrow of lendingAccount.borrows) {
        if (
          borrow.borrowReserve.toString() === zeroAdressValue ||
          borrow.borrowedAmountSf.isLessThanOrEqualTo(0)
        )
          continue;

        const reserve = reserves[borrow.borrowReserve.toString()];
        if (!reserve) continue;

        const { cumulativeBorrowRate } = reserve;
        const obligationCumulativeBorrowRate = getCumulativeBorrowRate(
          borrow.cumulativeBorrowRateBsf
        );
        const amountRaw = sfToValue(
          borrow.borrowedAmountSf
            .multipliedBy(cumulativeBorrowRate)
            .dividedBy(obligationCumulativeBorrowRate)
        );
        element.addBorrowedAsset({
          address: reserve.liquidity.mintPubkey,
          amount: amountRaw.dividedBy(
            new BigNumber(10).pow(reserve.liquidity.mintDecimals)
          ),
          alreadyShifted: true,
        });
        element.addBorrowedWeight(Number(reserve.config.borrowFactorPct) / 100);
        element.addBorrowedYield([
          { apr: -reserve.borrowApr, apy: -aprToApy(reserve.borrowApr) },
        ]);
      }
    }
  }

  // ******
  // Multiply :  https://app.kamino.finance/lending/multiply
  // ******

  if (multiplyAccounts)
    for (const multiplyAccount of multiplyAccounts) {
      if (!multiplyAccount) continue;

      const lendingConfig = lendingConfigs.get(
        multiplyAccount.lendingMarket.toString()
      );
      const name = lendingConfig
        ? `Multiply ${lendingConfig.name}`
        : 'Multiply';

      const elevationGroup = elevationGroups.get(
        multiplyAccount.elevationGroup
      );

      const element = elementRegistry.addElementBorrowlend({
        label: 'Lending',
        name,
      });

      for (const deposit of multiplyAccount.deposits) {
        if (
          deposit.depositReserve.toString() === zeroAdressValue ||
          deposit.depositedAmount.isLessThanOrEqualTo(0)
        )
          continue;

        const amountRaw = deposit.depositedAmount;
        const reserve = reserves[deposit.depositReserve.toString()];
        if (!reserve) continue;

        element.addSuppliedAsset({
          address: reserve.liquidity.mintPubkey,
          amount: amountRaw
            .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
            .dividedBy(reserve.exchangeRate),
          alreadyShifted: true,
        });

        if (elevationGroup)
          element.addSuppliedLtv(elevationGroup.liquidationThresholdPct / 100);
        else {
          element.addSuppliedLtv(0);
        }
        element.addSuppliedYield([
          { apr: reserve.supplyApr, apy: aprToApy(reserve.supplyApr) },
        ]);
      }
      for (const borrow of multiplyAccount.borrows) {
        if (
          borrow.borrowReserve.toString() === zeroAdressValue ||
          borrow.borrowedAmountSf.isLessThanOrEqualTo(0)
        )
          continue;

        const amountRaw = borrow.borrowedAmountSf.dividedBy(2 ** 60);
        const reserve = reserves[borrow.borrowReserve.toString()];
        if (!reserve) continue;

        element.addBorrowedAsset({
          address: reserve.liquidity.mintPubkey,
          amount: amountRaw.dividedBy(
            new BigNumber(10).pow(reserve.liquidity.mintDecimals)
          ),
          alreadyShifted: true,
        });
        element.addBorrowedWeight(Number(reserve.config.borrowFactorPct) / 100);
        element.addBorrowedYield([
          { apr: -reserve.borrowApr, apy: -aprToApy(reserve.borrowApr) },
        ]);
      }
    }

  // ******
  // Leverage :  https://app.kamino.finance/lending/leverage
  // ******

  for (const leverageAccount of leverageAccounts) {
    if (!leverageAccount) continue;

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name: 'Leverage',
    });

    for (const deposit of leverageAccount.deposits) {
      if (
        deposit.depositReserve.toString() === zeroAdressValue ||
        deposit.depositedAmount.isLessThanOrEqualTo(0)
      )
        continue;

      const amountRaw = deposit.depositedAmount;
      const reserve = reserves[deposit.depositReserve.toString()];
      if (!reserve) continue;

      element.addSuppliedAsset({
        address: reserve.liquidity.mintPubkey,
        amount: amountRaw
          .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
          .dividedBy(reserve.exchangeRate),
        alreadyShifted: true,
      });
      element.addSuppliedLtv(reserve.config.liquidationThresholdPct / 100);
      element.addSuppliedYield([
        { apr: reserve.supplyApr, apy: aprToApy(reserve.supplyApr) },
      ]);
    }
    for (const borrow of leverageAccount.borrows) {
      if (
        borrow.borrowReserve.toString() === zeroAdressValue ||
        borrow.borrowedAmountSf.isLessThanOrEqualTo(0)
      )
        continue;

      const amountRaw = borrow.borrowedAmountSf.dividedBy(
        borrow.cumulativeBorrowRateBsf.value0
      );
      const reserve = reserves[borrow.borrowReserve.toString()];
      if (!reserve) continue;

      element.addBorrowedAsset({
        address: reserve.liquidity.mintPubkey,
        amount: amountRaw.dividedBy(
          new BigNumber(10).pow(reserve.liquidity.mintDecimals)
        ),
        alreadyShifted: true,
      });
      element.addBorrowedWeight(Number(reserve.config.borrowFactorPct) / 100);
      element.addBorrowedYield([
        { apr: -reserve.borrowApr, apy: -aprToApy(reserve.borrowApr) },
      ]);
    }
  }

  return elementRegistry.dump(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
