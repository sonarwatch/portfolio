import { Cache } from './Cache';
import { NetworkIdType } from './Network';
import { PortfolioElement } from './Portfolio';
import { formatAddress } from './utils';

export type FetcherExecutor = (
  owner: string,
  cache: Cache
) => Promise<PortfolioElement[]>;
export type Fetcher = {
  id: string;
  networkId: NetworkIdType;
  executor: FetcherExecutor;
};

export function runFetcherExecutor(
  fetcher: Fetcher,
  owner: string,
  cache: Cache
) {
  const fOwner = formatAddress(owner, fetcher.networkId);
  return fetcher.executor(fOwner, cache);
}
