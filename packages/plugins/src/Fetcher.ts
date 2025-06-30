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
  promiseTimeout,
} from '@sonarwatch/portfolio-core';
import { Cache } from './Cache';

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

export function getFetchersResult(
  owner: string,
  addressSystem: AddressSystemType,
  results: FetcherResult[]
): FetchersResult {
  const fOwner = formatAddress(owner, addressSystem);
  const isValid = results.every(
    (r) =>
      networks[r.networdkId].addressSystem === addressSystem &&
      fOwner === r.owner
  );
  if (!isValid) {
    throw new Error(
      `Not all results have the right address system: ${addressSystem} or same owner: ${fOwner}`
    );
  }

  const elements: PortfolioElement[] = [];
  const fReports: FetcherReport[] = [];
  results.forEach((r) => {
    elements.push(...r.elements);

    let fReport: FetcherReport;
    if (r.error === undefined) {
      fReport = {
        id: r.fetcherId,
        status: 'succeeded',
        duration: r.duration,
        error: undefined,
      };
    } else {
      fReport = {
        id: r.fetcherId,
        status: 'failed',
        duration: undefined,
        error: r.error,
      };
    }
    fReports.push(fReport);
  });

  return {
    date: Date.now(),
    owner: fOwner,
    addressSystem,
    fetcherReports: fReports,
    value: getUsdValueSum(elements.map((e) => e.value)),
    elements,
    duration: 0,
  };
}

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

export async function runFetcherSafe(
  owner: string,
  fetcher: Fetcher,
  cache: Cache
): Promise<FetcherResult> {
  const startDate = Date.now();
  try {
    return await runFetcher(owner, fetcher, cache);
  } catch (e) {
    return {
      owner: formatAddressByNetworkId(owner, fetcher.networkId),
      fetcherId: fetcher.id,
      networdkId: fetcher.networkId,
      duration: Date.now() - startDate,
      elements: [],
      error: e instanceof Error ? e.message : 'Ukn error runFetcherSafe',
    };
  }
}
