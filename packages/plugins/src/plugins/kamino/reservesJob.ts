import {
  aprToApy,
  BorrowLendRate,
  borrowLendRatesPrefix,
  NetworkId,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { dataSizeFilter } from '../../utils/solana/filters';
import {
  klendProgramId,
  reservesKey,
  platformId,
  lendingConfigs,
} from './constants';
import { reserveStruct } from './structs/klend';
import { calculateBorrowAPR, calculateSupplyAPR } from './helpers/apr';
import { ReserveEnhanced } from './types';
import { getCumulativeBorrowRate, getEchangeRate } from './helpers/common';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const reservesAccounts = (
    await Promise.all([
      getParsedProgramAccounts(
        client,
        reserveStruct,
        klendProgramId,
        dataSizeFilter(8624)
      ),
      getParsedProgramAccounts(
        client,
        reserveStruct,
        klendProgramId,
        dataSizeFilter(8464)
      ),
    ])
  ).flat();
  const items = [];
  if (reservesAccounts.length !== 0) {
    const reserveById: Record<string, ReserveEnhanced> = {};
    for (const reserve of reservesAccounts) {
      if (
        reserve.lendingMarket.toString() === '11111111111111111111111111111111'
      )
        continue;
      const borrowApr = calculateBorrowAPR(reserve);
      const supplyApr = calculateSupplyAPR(reserve);
      const exchangeRate = getEchangeRate(reserve);
      const cumulativeBorrowRate = getCumulativeBorrowRate(
        reserve.liquidity.cumulativeBorrowRateBsf
      ).toString();
      reserveById[reserve.pubkey.toString()] = {
        ...reserve,
        borrowApr,
        supplyApr,
        exchangeRate,
        cumulativeBorrowRate,
      };
      const borrowedAmountRaw = reserve.liquidity.borrowedAmountSf.dividedBy(
        2 ** 60
      );
      const depositedAmountRaw =
        reserve.liquidity.availableAmount.plus(borrowedAmountRaw);
      const decimalsFactor = 10 ** reserve.liquidity.mintDecimals.toNumber();

      const rate: BorrowLendRate = {
        tokenAddress: reserve.liquidity.mintPubkey.toString(),
        depositedAmount: depositedAmountRaw
          .dividedBy(decimalsFactor)
          .toNumber(),
        depositYield: {
          apy: aprToApy(supplyApr),
          apr: supplyApr,
        },
        borrowedAmount: borrowedAmountRaw.dividedBy(decimalsFactor).toNumber(),
        borrowYield: {
          apy: aprToApy(borrowApr),
          apr: borrowApr,
        },
        utilizationRatio: borrowedAmountRaw
          .dividedBy(depositedAmountRaw)
          .toNumber(),
        platformId,
        poolName: lendingConfigs.get(reserve.lendingMarket.toString())?.name,
      };
      items.push({
        key: `${reserve.pubkey.toString()}-${reserve.liquidity.mintPubkey.toString()}`,
        value: rate,
      });
    }
    await cache.setItems(items, {
      prefix: borrowLendRatesPrefix,
      networkId: NetworkId.solana,
    });
    await cache.setItem(reservesKey, reserveById, {
      prefix: platformId,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-reserves`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
