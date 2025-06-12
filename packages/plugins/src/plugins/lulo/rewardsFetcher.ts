import {
  NetworkId,
  PortfolioElement,
  PortfolioElementMultiple,
} from '@sonarwatch/portfolio-core';
import { platformId } from './constants';
import driftAirdropFetcher from '../drift/airdropFetcher';
import solendRewardsFetcher from '../save/rewardsFetcher';
import { getDerivedAccount } from './helpers';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { lfgFetchers } from '../jupiter/launchpad';

const executor: FetcherExecutor = async (
  owner: string,
  cache: Cache
): Promise<PortfolioElement[]> => {
  const pda = getDerivedAccount(owner);

  const res = (
    await Promise.all([
      driftAirdropFetcher.executor(pda, cache),
      solendRewardsFetcher.executor(pda, cache),
      ...lfgFetchers
        .filter((fetcher) => fetcher.id.includes('kamino'))
        .map((fetcher) => fetcher.executor(pda, cache)),
    ])
  ).flat();

  return res.map((element) => {
    const tmpElement = element as PortfolioElementMultiple;
    tmpElement.data.link = `https://app.lulo.fi/rewards?address=${owner}`;
    return {
      ...tmpElement,
      platformId,
      label: 'Rewards',
    };
  });
};

const fetcher: Fetcher = {
  id: `${platformId}-rewards`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
