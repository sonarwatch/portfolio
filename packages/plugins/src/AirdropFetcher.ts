import {
  AddressSystemType,
  Airdrop,
  AirdropFetcherReport,
  AirdropFetcherResult,
  AirdropFetchersResult,
  AirdropItem,
  AirdropItemStatus,
  AirdropStatus,
  IsClaimed,
  NetworkIdType,
  PortfolioAsset,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
  UsdValue,
  formatAddress,
  formatAddressByNetworkId,
  getAirdropItemStatus,
  getAirdropStatus,
  getIsEligible,
  networks,
} from '@sonarwatch/portfolio-core';
import { Cache } from './Cache';
import promiseTimeout from './utils/misc/promiseTimeout';
import { Fetcher } from './Fetcher';
import tokenPriceToAssetToken from './utils/misc/tokenPriceToAssetToken';

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

export type AirdropStatics = Omit<Airdrop, 'status' | 'item'>;

export function getAirdrop(params: {
  statics: AirdropStatics;
  item: {
    amount: number;
    label: string;
    price: UsdValue;
    imageUri?: string;
    address?: string;
    isClaimed: IsClaimed;
  };
}): Airdrop {
  const status = getAirdropStatus(
    params.statics.claimStart,
    params.statics.claimEnd
  );
  return {
    ...params.statics,
    status,
    item: getAirdropItem({ ...params.item, airdropStatus: status }),
  };
}

export function getAirdropItem(params: {
  airdropStatus: AirdropStatus;
  amount: number;
  label: string;
  price: UsdValue;
  imageUri?: string;
  address?: string;
  isClaimed: IsClaimed;
}): AirdropItem {
  const isEligible = getIsEligible(params.amount);
  return {
    amount: params.amount,
    isClaimed: isEligible === false ? false : params.isClaimed,
    isEligible,
    label: params.label,
    price: params.price,
    status: getAirdropItemStatus(
      params.airdropStatus,
      params.amount,
      params.isClaimed
    ),
    address: params.address,
    imageUri: params.imageUri,
  };
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

export function airdropFetcherToFetcher(
  airdropFetcher: AirdropFetcher,
  platformId: string,
  id: string,
  claimEnd?: number
): Fetcher {
  return {
    id,
    networkId: airdropFetcher.networkId,
    executor: async (
      owner: string,
      cache: Cache
    ): Promise<PortfolioElementMultiple[]> => {
      if (claimEnd && Date.now() > claimEnd) return [];

      const airdrop = await airdropFetcher.executor(owner, cache);
      if (
        airdrop.item.status !== AirdropItemStatus.claimable &&
        airdrop.item.status !== AirdropItemStatus.claimableLater
      )
        return [];

      const { item } = airdrop;
      const asset: PortfolioAsset = item.address
        ? tokenPriceToAssetToken(
            item.address,
            item.amount,
            airdropFetcher.networkId,
            undefined,
            item.price || undefined,
            { isClaimable: true, lockedUntil: airdrop.claimStart }
          )
        : {
            type: PortfolioAssetType.generic,
            data: {
              amount: item.amount,
              price: item.price,
            },
            name: item.label,
            networkId: airdropFetcher.networkId,
            attributes: { isClaimable: true, lockedUntil: airdrop.claimStart },
            value: item.price ? item.price * item.amount : null,
            imageUri: item.imageUri,
          };
      return [
        {
          networkId: airdropFetcher.networkId,
          label: 'Airdrop',
          data: {
            assets: [asset],
          },
          platformId,
          type: PortfolioElementType.multiple,
          value: asset.value,
          name: airdrop.name,
        },
      ];
    },
  };
}
