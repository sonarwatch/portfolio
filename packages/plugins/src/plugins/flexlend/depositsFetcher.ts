import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getDerivedAccount } from './helpers';
import solendDepositsFetcher from '../solend/obligationsFetcher';
import driftDepositsFetcher from '../drift/spotPositionsFetcher';
import { fetchers as marginfiDepositsFetchers } from '../marginfi/index';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const pda = getDerivedAccount(owner);

  const portfolioElements = (
    await Promise.all([
      marginfiDepositsFetchers[0].executor(pda, cache),
      solendDepositsFetcher.executor(pda, cache),
      driftDepositsFetcher.executor(pda, cache),
    ])
  ).flat();

  if (portfolioElements.length === 0) return [];

  const elements: PortfolioElement[] = [];
  for (const element of portfolioElements) {
    const tmpElement = element;
    tmpElement.name = tmpElement.platformId;
    tmpElement.platformId = platformId;
    elements.push({
      ...tmpElement,
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
