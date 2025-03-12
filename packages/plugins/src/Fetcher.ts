import {
  AddressSystemType,
  FetcherReport,
  FetcherResult,
  FetchersResult,
  NetworkIdType,
  PortfolioElement,
  formatAddress,
  formatAddressByNetworkId,
  getUsdValueSum,
  networks,
  sortPortfolioElement,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from './Cache';
import promiseTimeout from './utils/misc/promiseTimeout';
import { getClientSolana } from './utils/clients';

const runFetcherTimeout = 60000;

export type FetcherExecutor = (
  owner: string,
  cache: Cache
) => Promise<PortfolioElement[]>;

export type Fetcher = {
  id: string;
  networkId: NetworkIdType;
  executor: FetcherExecutor;
};

export async function runFetchers(
  owner: string,
  addressSystem: AddressSystemType,
  fetchers: Fetcher[],
  cache: Cache
): Promise<FetchersResult> {
  const fOwner = formatAddress(owner, addressSystem);
  const isFetchersValids = fetchers.every(
    (f) => networks[f.networkId].addressSystem === addressSystem
  );
  if (!isFetchersValids)
    throw new Error(
      `Not all fetchers have the right address system: ${addressSystem}`
    );

  const startDate = Date.now();
  if (!(await isAddressActive(cache, fOwner, addressSystem))) {
    const fetchEnd = Date.now();
    return {
      owner: fOwner,
      addressSystem,
      fetcherReports: [
        {
          id: 'address-is-inactive',
          status: 'succeeded',
          duration: fetchEnd - startDate,
        },
      ],
      value: 0,
      elements: [],
      duration: fetchEnd - startDate,
      date: fetchEnd,
    };
  }
  const promises = fetchers.map((f) => runFetcher(fOwner, f, cache));
  const result = await Promise.allSettled(promises);

  const fReports: FetcherReport[] = [];
  const elements = result.flatMap((r, index) => {
    let fReport: FetcherReport;
    if (r.status === 'fulfilled') {
      fReport = {
        id: fetchers[index].id,
        status: 'succeeded',
        duration: r.value.duration,
        error: undefined,
      };
    } else {
      fReport = {
        id: fetchers[index].id,
        status: 'failed',
        duration: undefined,
        error: r.reason.message || 'Unknown error',
      };
    }
    fReports.push(fReport);

    if (r.status === 'rejected') return [];
    return r.value.elements;
  });
  return {
    date: Date.now(),
    owner: fOwner,
    addressSystem,
    fetcherReports: fReports,
    value: getUsdValueSum(elements.map((e) => e.value)),
    elements,
    duration: Date.now() - startDate,
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

export async function runFetcher(
  owner: string,
  fetcher: Fetcher,
  cache: Cache
): Promise<FetcherResult> {
  const startDate = Date.now();
  const fOwner = formatAddressByNetworkId(owner, fetcher.networkId);
  const fetcherPromise = fetcher.executor(fOwner, cache).then(
    (elements): FetcherResult => ({
      owner: fOwner,
      fetcherId: fetcher.id,
      networdkId: fetcher.networkId,
      duration: Date.now() - startDate,
      elements: elements.map((e) => sortPortfolioElement(e)),
    })
  );
  return promiseTimeout(
    fetcherPromise,
    runFetcherTimeout,
    `Fetcher timed out: ${fetcher.id}`
  );
}

export async function isAddressActive(
  cache: Cache,
  owner: string,
  addressSystem: AddressSystemType
): Promise<boolean> {
  if (addressSystem === 'solana') {
    const isCached = await cache.getItem<boolean>(owner, {
      prefix: `${addressSystem}/isActive`,
    });
    if (isCached) return true;

    const client = getClientSolana();
    const tx = await client.getSignaturesForAddress(new PublicKey(owner), {
      limit: 1,
    });
    if (tx.length === 0) {
      return false;
    }
    await cache.setItem(owner, true, {
      prefix: `${addressSystem}/isActive`,
      ttl: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return true;
}
