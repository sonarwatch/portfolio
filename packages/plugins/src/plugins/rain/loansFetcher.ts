import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, programId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { LoanStatus, loanStruct } from './structs/loan';
import { loanBorrowerFilter } from './filters';
import { getPool } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  // Trying to get https://solscan.io/account/DEJJn6yf7wzjRAYW62xVE7b6ANU251E9MydvHFhU6wFY
  const loans = await getParsedProgramAccounts(
    client,
    loanStruct,
    programId,
    loanBorrowerFilter(owner)
  );

  // const borrowedAssets: PortfolioAsset[] = [];
  // const borrowedYields: Yield[][] = [];
  // const suppliedAssets: PortfolioAsset[] = [];
  // const suppliedYields: Yield[][] = [];
  // const rewardAssets: PortfolioAsset[] = [];
  for (const loan of loans) {
    console.log('constexecutor:FetcherExecutor= ~ loan:', loan);
    console.log(
      'constexecutor:FetcherExecutor= ~ loan listing:',
      loan.listing.price.toNumber()
    );
    if (loan.status !== LoanStatus.Ongoing) continue;

    if (loan.isDefi) {
      const amountBorrowed = loan.amount;
      console.log(
        'constexecutor:FetcherExecutor= ~ amountBorrowed:',
        amountBorrowed.toNumber()
      );
    } else {
      console.log('Its not DeFi');
    }
  }
  const elements: PortfolioElement[] = [];
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-loans`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
