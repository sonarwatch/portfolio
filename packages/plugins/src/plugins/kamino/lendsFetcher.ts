import { NetworkId, aprToApy } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  elevationGroupsKey,
  lendingConfigs,
  marketsKey,
  reservesKey,
  platformId,
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
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { arrayToMap } from '../../utils/misc/arrayToMap';

const zeroAdressValue = '11111111111111111111111111111111';

const marketsMemo = new MemoizedCache<string[]>(marketsKey, {
  prefix: platformId,
  networkId: NetworkId.solana,
});

const elevationGroupsAccountsMemo = new MemoizedCache<
  ElevationGroup[],
  Map<number, ElevationGroup>
>(
  elevationGroupsKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  },
  (arr) => arrayToMap<ElevationGroup, number>(arr || [], 'id')
);

const reservesMemo = new MemoizedCache<Record<string, ReserveDataEnhanced>>(
  reservesKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const markets = await marketsMemo.getItem(cache);
  if (!markets) throw new Error('Markets not cached');

  const [lendingPdas, multiplyPdas, leveragePdas] = [
    getLendingPda(owner, markets),
    getMultiplyPdas(owner, markets),
    getLeveragePdas(owner),
  ];

  const obligations = await getParsedMultipleAccountsInfo(
    client,
    obligationStruct,
    [...lendingPdas, ...multiplyPdas, ...leveragePdas]
  );

  if (!obligations.some((obligation) => obligation !== null)) return [];

  const reserves = await reservesMemo.getItem(cache);
  if (!reserves) throw new Error('Reserves not cached');

  const elevationGroups = await elevationGroupsAccountsMemo.getItem(cache);

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  const tokens = new Set<string>();
  for (let index = 0; index < obligations.length; index++) {
    const obligation = obligations[index];
    if (!obligation) continue;
    for (const deposit of obligation.deposits) {
      if (
        deposit.depositReserve.toString() === zeroAdressValue ||
        deposit.depositedAmount.isLessThanOrEqualTo(0)
      )
        continue;

      const reserve = reserves[deposit.depositReserve.toString()];
      if (!reserve) continue;
      tokens.add(reserve.liquidity.mintPubkey);
    }
    for (const borrow of obligation.borrows) {
      if (
        borrow.borrowReserve.toString() === zeroAdressValue ||
        borrow.borrowedAmountSf.isLessThanOrEqualTo(0)
      )
        continue;

      const reserve = reserves[borrow.borrowReserve.toString()];
      if (!reserve) continue;
      tokens.add(reserve.liquidity.mintPubkey);
    }
  }

  const tokenPrices = await cache.getTokenPricesAsMap(tokens, NetworkId.solana);

  for (let index = 0; index < obligations.length; index++) {
    const obligation = obligations[index];
    if (!obligation) continue;

    const lendingConfig = lendingConfigs.get(
      obligation.lendingMarket.toString()
    );

    let name;
    let type = 'lending';
    let link;
    if (index < lendingPdas.length) {
      name = lendingConfig?.name;
      link = `https://app.kamino.finance/lending/dashboard/${obligation.lendingMarket.toString()}/${obligation.pubkey.toString()}`;
    } else if (index < lendingPdas.length + multiplyPdas.length) {
      name = lendingConfig ? `Multiply ${lendingConfig.name}` : 'Multiply';
      type = 'multiply';
      link = `https://app.kamino.finance/lending/multiply/${obligation.lendingMarket.toString()}/${obligation.deposits[0].depositReserve.toString()}/${obligation.borrows[0].borrowReserve.toString()}`;
    } else {
      name = 'Leverage';
      type = 'leverage';
      link = `https://app.kamino.finance/lending/leverage/${obligation.lendingMarket.toString()}/${obligation.deposits[0].depositReserve.toString()}/${obligation.borrows[0].borrowReserve.toString()}`;
    }

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      name,
      ref: obligation.pubkey,
      sourceRefs: [
        {
          name: 'Lending Market',
          address: obligation.lendingMarket.toString(),
        },
      ],
      link,
    });

    let userTotalDeposit = new BigNumber(0);

    for (const deposit of obligation.deposits) {
      if (
        deposit.depositReserve.toString() === zeroAdressValue ||
        deposit.depositedAmount.isLessThanOrEqualTo(0)
      )
        continue;

      const amountRaw = deposit.depositedAmount;
      const reserve = reserves[deposit.depositReserve.toString()];
      if (!reserve) continue;

      const priceX = tokenPrices.get(reserve.liquidity.mintPubkey);
      if (priceX) {
        const depositValueUsd = amountRaw
          .dividedBy(reserve.exchangeRate)
          .multipliedBy(priceX.price)
          .div(new BigNumber(10).pow(reserve.liquidity.mintDecimals));
        userTotalDeposit = userTotalDeposit.plus(depositValueUsd);
      }

      element.addSuppliedAsset({
        address: reserve.liquidity.mintPubkey,
        amount: amountRaw
          .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals))
          .dividedBy(reserve.exchangeRate),
        alreadyShifted: true,
        sourceRefs: [
          { name: 'Reserve', address: deposit.depositReserve.toString() },
        ],
      });

      if (type === 'multiply') {
        const elevationGroup = elevationGroups.get(obligation.elevationGroup);
        if (elevationGroup)
          element.addSuppliedLtv(elevationGroup.liquidationThresholdPct / 100);
        else {
          element.addSuppliedLtv(0);
        }
      } else {
        element.addSuppliedLtv(reserve.config.liquidationThresholdPct / 100);
      }

      element.addSuppliedYield([
        { apr: reserve.supplyApr, apy: aprToApy(reserve.supplyApr) },
      ]);
    }

    let userTotalBorrow = new BigNumber(0);

    for (const borrow of obligation.borrows) {
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

      const priceX = tokenPrices.get(reserve.liquidity.mintPubkey);
      if (priceX) {
        const borrowValueUsd = amountRaw
          .multipliedBy(priceX.price)
          .dividedBy(new BigNumber(10).pow(reserve.liquidity.mintDecimals));
        userTotalBorrow = userTotalBorrow.plus(borrowValueUsd);
      }
      element.addBorrowedAsset({
        address: reserve.liquidity.mintPubkey,
        amount: amountRaw.dividedBy(
          new BigNumber(10).pow(reserve.liquidity.mintDecimals)
        ),
        alreadyShifted: true,
        sourceRefs: [
          { name: 'Reserve', address: borrow.borrowReserve.toString() },
        ],
      });
      element.addBorrowedWeight(Number(reserve.config.borrowFactorPct) / 100);
      element.addBorrowedYield([
        { apr: -reserve.borrowApr, apy: -aprToApy(reserve.borrowApr) },
      ]);
    }

    if (['multiply', 'leverage'].includes(type)) {
      const netAccountValue = userTotalDeposit.minus(userTotalBorrow);
      const leverage = userTotalDeposit.dividedBy(netAccountValue);

      element.setName(
        `${element.name} ${leverage.decimalPlaces(2).toString()}x`
      );
    }
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
