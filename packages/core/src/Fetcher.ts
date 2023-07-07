import { AddressSystemType } from './Address';
import { Cache } from './Cache';
import { NetworkIdType } from './Network';
import { PortfolioElement } from './Portfolio';
import { networks } from './constants';
import { formatAddress, formatAddressByNetworkId } from './utils';

export type FetcherExecutor = (
  owner: string,
  cache: Cache
) => Promise<PortfolioElement[]>;

export type Fetcher = {
  id: string;
  networkId: NetworkIdType;
  executor: FetcherExecutor;
};

export type FetcherResult = {
  owner: string;
  addressSystem: AddressSystemType;
  fetcherIds: string[];
  succeededFetcherIds: string[];
  failedFetcherIds: string[];
  elements: PortfolioElement[];
  errors: Error[];
};

export async function runFetchers(
  owner: string,
  addressSystem: AddressSystemType,
  fetchers: Fetcher[],
  cache: Cache
): Promise<FetcherResult> {
  const fOwner = formatAddress(owner, addressSystem);
  const isFetchersValids = fetchers.every(
    (f) => networks[f.networkId].addressSystem === addressSystem
  );
  if (!isFetchersValids)
    throw new Error(
      `Not all fetchers have the right address system: ${addressSystem}`
    );

  const promises = fetchers.map((f) => f.executor(fOwner, cache));
  const result = await Promise.allSettled(promises);

  const failedFetcherIds: string[] = [];
  const succeededFetcherIds: string[] = [];
  const errors: Error[] = [];
  const elements = result.flatMap((r, index) => {
    const fetcherId = fetchers[index].id;
    if (r.status === 'rejected') {
      failedFetcherIds.push(fetcherId);
      errors.push(r.reason);
      return [];
    }
    succeededFetcherIds.push(fetcherId);
    return r.value;
  });
  const fetcherIds = failedFetcherIds.concat(succeededFetcherIds);
  return {
    owner: fOwner,
    addressSystem,
    fetcherIds,
    succeededFetcherIds,
    failedFetcherIds,
    elements,
    errors,
  };
}

export async function runFetchersByNetworkId(
  owner: string,
  networkId: NetworkIdType,
  fetchers: Fetcher[],
  cache: Cache
) {
  const isFetchersValids = fetchers.every((f) => f.networkId === networkId);
  if (!isFetchersValids)
    throw new Error(`Not all fetchers have the right network id: ${networkId}`);

  const { addressSystem } = networks[networkId];
  return runFetchers(owner, addressSystem, fetchers, cache);
}

export function runFetcher(owner: string, fetcher: Fetcher, cache: Cache) {
  const fOwner = formatAddressByNetworkId(owner, fetcher.networkId);
  return fetcher.executor(fOwner, cache);
}
