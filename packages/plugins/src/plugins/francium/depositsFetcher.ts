import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { lendingRewardProgramId, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { rewardAccountStruct } from './structs';
import { rewardUserAccountFilter } from './filters';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  console.log(
    'constexecutor:FetcherExecutor= ~ bytesize:',
    rewardAccountStruct.byteSize
  );
  const accounts = await getParsedProgramAccounts(
    client,
    rewardAccountStruct,
    lendingRewardProgramId,
    rewardUserAccountFilter(owner)
  );
  for (const account of accounts) {
    if (account.user_main.toString() === owner) {
      console.log('Amount : ', account.staked_amount.toNumber());
      console.log('Amount : ', account.rewards_debt.toNumber());
    }
  }

  const elements: PortfolioElement[] = [];
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
