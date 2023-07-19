import { Cache, Job, JobExecutor, NetworkId } from '@sonarwatch/portfolio-core';
import { DriftProgram, platformId, prefixSpotMarkets } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { spotMarketStruct } from './struct';
import { marketFilter } from './filters';
import { getClientSolana } from '../../utils/clients';
import { calculateBorrowRate, calculateDepositRate } from './helpers';
import { SpotMarketEnhanced } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const spotMarketsAccount = await getParsedProgramAccounts(
    client,
    spotMarketStruct,
    DriftProgram,
    marketFilter
  );
  if (!spotMarketsAccount) return;
  for (let index = 0; index < spotMarketsAccount.length; index++) {
    const spotMarketAccount = spotMarketsAccount[index];
    const depositApr = calculateDepositRate(spotMarketAccount).toNumber();
    const borrowApr = calculateBorrowRate(spotMarketAccount).toNumber();
    await cache.setItem<SpotMarketEnhanced>(
      spotMarketsAccount[index].marketIndex.toString(),
      {
        ...spotMarketAccount,
        depositApr,
        borrowApr,
      },
      { prefix: prefixSpotMarkets, networkId: NetworkId.solana }
    );
  }
};

const job: Job = {
  id: `${platformId}-spotMarkets`,
  executor,
};
export default job;
