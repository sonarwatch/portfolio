import { NetworkId } from '@sonarwatch/portfolio-core';
import { Job, JobExecutor } from '../../Job';
import { Cache } from '../../Cache';
import { platformId, boostProgramId, boostBanksKey } from './constants';
import { getParsedProgramAccounts } from '../../utils/solana';
import { bankStruct } from './struct';
import { boostBanksFilters } from './filters';
import { getClientSolana } from '../../utils/clients';
import { BankDetails } from './types';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    client,
    bankStruct,
    boostProgramId,
    boostBanksFilters
  );
  const banksDetails: BankDetails[] = [];
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    banksDetails.push({
      mint: account.mint.toString(),
      borrowIndex: account.borrowIndex.toString(),
      depositIndex: account.depositIndex.toString(),
      tokenIndex: account.tokenIndex,
    });
  }
  await cache.setItem(boostBanksKey, banksDetails, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
};

const job: Job = {
  id: `${platformId}-boost-banks`,
  networkIds: [NetworkId.solana],
  executor,
  labels: ['normal', NetworkId.solana],
};
export default job;
