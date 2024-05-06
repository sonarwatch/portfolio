import {
  AddressSystemType,
  Airdrop,
  AirdropFetcherReport,
  AirdropFetcherResult,
  AirdropFetchersResult,
  NetworkIdType,
  formatAddress,
  formatAddressByNetworkId,
  networks,
} from '@sonarwatch/portfolio-core';
import { Cache } from './Cache';
import promiseTimeout from './utils/misc/promiseTimeout';

export type AirdropFetcherExecutor = (
  owner: string,
  cache: Cache
) => Promise<Airdrop>;

export type AirdropFetcher = {
  id: string;
  networkId: NetworkIdType;
  executor: AirdropFetcherExecutor;
};

const runAirdropFetcherTimeout = 10000;

export async function runAirdropFetchersByNetworkId(
  owner: string,
  networkId: NetworkIdType,
  fetchers: AirdropFetcher[],
  cache: Cache
) {
  const isFetchersValids = fetchers.every((f) => f.networkId === networkId);
  if (!isFetchersValids)
    throw new Error(
      `Not all airdrop fetchers have the right network id: ${networkId}`
    );

  const { addressSystem } = networks[networkId];
  return runAirdropFetchers(owner, addressSystem, fetchers, cache);
}

export async function runAirdropFetchers(
  owner: string,
  addressSystem: AddressSystemType,
  fetchers: AirdropFetcher[],
  cache: Cache
): Promise<AirdropFetchersResult> {
  const fOwner = formatAddress(owner, addressSystem);
  const isFetchersValids = fetchers.every(
    (f) => networks[f.networkId].addressSystem === addressSystem
  );
  if (!isFetchersValids)
    throw new Error(
      `Not all fetchers have the right address system: ${addressSystem}`
    );

  const promises = fetchers.map((f) => runAirdropFetcher(fOwner, f, cache));
  const result = await Promise.allSettled(promises);

  const fReports: AirdropFetcherReport[] = [];
  const airdrops = result.flatMap((r, index) => {
    let fReport: AirdropFetcherReport;
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
    return r.value.airdrop;
  });
  return {
    date: Date.now(),
    owner: fOwner,
    addressSystem,
    fetcherReports: fReports,
    airdrops,
  };
}

export async function runAirdropFetcher(
  owner: string,
  fetcher: AirdropFetcher,
  cache: Cache
): Promise<AirdropFetcherResult> {
  const startDate = Date.now();
  const fOwner = formatAddressByNetworkId(owner, fetcher.networkId);
  const fetcherPromise = fetcher
    .executor(fOwner, cache)
    .then((airdrop): AirdropFetcherResult => {
      const now = Date.now();
      return {
        owner: fOwner,
        fetcherId: fetcher.id,
        networdkId: fetcher.networkId,
        duration: now - startDate,
        airdrop,
        date: now,
      };
    });
  return promiseTimeout(
    fetcherPromise,
    runAirdropFetcherTimeout,
    `Fetcher timed out: ${fetcher.id}`
  );
}
