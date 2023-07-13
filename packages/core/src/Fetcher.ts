import { AddressSystemType } from './Address';
import { Cache } from './Cache';
import { NetworkIdType } from './Network';
import { PortfolioElement } from './Portfolio';
import { networks } from './constants';
import {
  formatAddress,
  formatAddressByNetworkId,
  getAddressSystem,
} from './utils';

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
  fetcherId: string;
  networdkId: NetworkIdType;
  elements: PortfolioElement[];
  duration: number;
};

export type FetchersResult = {
  owner: string;
  addressSystem: AddressSystemType;
  fetcherIds: string[];
  succeededFetcherIds: string[];
  failedFetcherIds: string[];
  elements: PortfolioElement[];
  errors: Record<string, string>;
};

export async function runFetchers(
  owner: string,
  fetchers: Fetcher[],
  cache: Cache
): Promise<FetchersResult> {
  const addressSystem = getAddressSystem(owner);
  if (!addressSystem)
    throw new Error(
      `Owner address does not correspond to any address system: ${owner}`
    );
  const fOwner = formatAddress(owner, addressSystem);

  const fFetchers = fetchers.filter(
    (f) => networks[f.networkId].addressSystem === addressSystem
  );

  const promises = fFetchers.map((f) => f.executor(fOwner, cache));
  const result = await Promise.allSettled(promises);

  const failedFetcherIds: string[] = [];
  const succeededFetcherIds: string[] = [];
  const errors: Record<string, string> = {};
  const elements = result.flatMap((r, index) => {
    const fetcherId = fFetchers[index].id;
    if (r.status === 'rejected') {
      failedFetcherIds.push(fetcherId);
      errors[fetcherId] = r.reason.message || 'Unknown error';
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
  return runFetchers(owner, fetchers, cache);
}

export async function runFetcher(
  owner: string,
  fetcher: Fetcher,
  cache: Cache
): Promise<FetcherResult> {
  const startDate = Date.now();
  const fOwner = formatAddressByNetworkId(owner, fetcher.networkId);
  const elements = await fetcher.executor(fOwner, cache);
  return {
    owner: fOwner,
    fetcherId: fetcher.id,
    networdkId: fetcher.networkId,
    elements,
    duration: Date.now() - startDate,
  };
}
