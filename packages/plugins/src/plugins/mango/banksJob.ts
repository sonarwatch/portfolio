import {
  BorrowLendRate,
  NetworkId,
  aprToApy,
  borrowLendRatesPrefix,
} from '@sonarwatch/portfolio-core';
import { BankEnhanced } from './types';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';
import { mangoV4Pid, platformId, banksKey } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { bankStruct } from './struct';
import { banksFilter } from './filters';
import { getBorrowRate, getDepositRate } from './helpers';
import { getClientSolana } from '../../utils/clients';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const banksAccount = await getParsedProgramAccounts(
    client,
    bankStruct,
    mangoV4Pid,
    banksFilter
  );
  if (!banksAccount) return;

  const banks: BankEnhanced[] = [];
  const rateItems = [];
  for (let index = 0; index < banksAccount.length; index++) {
    const bank = banksAccount[index];
    if (!bank) continue;

    const depositApr = getDepositRate(bank);
    const borrowApr = getBorrowRate(bank);
    banks.push({
      ...bank,
      depositApr,
      borrowApr,
    });
    const decimals = bank.mintDecimals;
    const borrowedAmount = bank.depositIndex
      .multipliedBy(bank.indexedDeposits)
      .dividedBy(10 ** decimals)
      .toNumber();
    const depositedAmount = bank.borrowIndex
      .multipliedBy(bank.indexedBorrows)
      .dividedBy(10 ** decimals)
      .toNumber();

    if (borrowedAmount <= 10 && depositedAmount <= 10) continue;

    const rate: BorrowLendRate = {
      tokenAddress: bank.mint.toString(),
      borrowYield: {
        apy: aprToApy(borrowApr),
        apr: borrowApr,
      },
      borrowedAmount,
      depositYield: {
        apy: aprToApy(depositApr),
        apr: depositApr,
      },
      depositedAmount,
      platformId,
      poolName: 'Main',
    };
    rateItems.push({
      key: `${bank.vault.toString()}-${bank.mint.toString()}`,
      value: rate,
    });
  }
  await cache.setItem(banksKey, banks, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  await cache.setItems(rateItems, {
    prefix: borrowLendRatesPrefix,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-banks`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
