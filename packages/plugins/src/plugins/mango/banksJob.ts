import {
  BorrowLendRate,
  NetworkId,
  aprToApy,
  borrowLendRatesPrefix,
} from '@sonarwatch/portfolio-core';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';
import { MangoProgram, banksPrefix, platformId } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { bankStruct } from './struct';
import { banksFilter } from './filters';
import { getBorrowRate, getDepositRate } from './helpers';
import { getClientSolana } from '../../utils/clients';
import { fetchTokenSupplyAndDecimals } from '../../utils/solana/fetchTokenSupplyAndDecimals';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const banksAccount = await getParsedProgramAccounts(
    client,
    bankStruct,
    MangoProgram,
    banksFilter
  );
  if (!banksAccount) return;
  for (let index = 0; index < banksAccount.length; index++) {
    const bank = banksAccount[index];
    if (!bank) continue;
    const depositApr = getDepositRate(bank);
    const borrowApr = getBorrowRate(bank);
    await cache.setItem(
      bank.tokenIndex.toString(),
      {
        ...bank,
        depositApr,
        borrowApr,
      },
      { prefix: banksPrefix, networkId: NetworkId.solana }
    );

    const tokenAddress = bank.mint.toString();
    const res = await fetchTokenSupplyAndDecimals(bank.mint, client);
    if (!res) continue;
    const { decimals } = res;

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
      tokenAddress,
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

    await cache.setItem(`${bank.vault.toString()}-${tokenAddress}`, rate, {
      prefix: borrowLendRatesPrefix,
      networkId: NetworkId.solana,
    });
  }
};

const job: Job = {
  id: `${platformId}-banks`,
  executor,
};
export default job;
