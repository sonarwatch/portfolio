import {
  AddressSystemType,
  FetcherReport,
  FetcherResult,
  FetchersResult,
  formatAddress,
  formatAddressByNetworkId,
  getUsdValueSum,
  NetworkIdType,
  networks,
  PortfolioElement,
  promiseTimeout,
  sortPortfolioElement,
} from '@sonarwatch/portfolio-core';
import { Cache } from './Cache';
import pLimit from 'p-limit';

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
  const concurrency = process.env['PORTFOLIO_PARALLEL_FETCHERS_LIMIT']
    ? parseInt(process.env['PORTFOLIO_PARALLEL_FETCHERS_LIMIT'], 10)
    : 50;
  const limit = pLimit(concurrency);
  const fOwner = formatAddress(owner, addressSystem);
  const isFetchersValids = fetchers.every(
    (f) => networks[f.networkId].addressSystem === addressSystem
  );
  if (!isFetchersValids)
    throw new Error(
      `Not all fetchers have the right address system: ${addressSystem}`
    );

  const startDate = Date.now();
  const promises = fetchers.map((f) =>
    limit(() => runFetcher(fOwner, f, cache))
  );
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
      console.error(
        { error: r.reason },
        `Failed to execute fetcher. Address: ${owner} Fetcher: ${fetchers[index].id}`
      );
      fReport = {
        id: fetchers[index].id,
        status: 'failed',
        duration: r.reason.duration,
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
  try {
    return await promiseTimeout(
      fetcherPromise,
      runFetcherTimeout,
      `Fetcher timed out: ${fetcher.id}`
    );
  } catch (err: any) {
    err.duration = Date.now() - startDate;
    throw err;
  }
}
