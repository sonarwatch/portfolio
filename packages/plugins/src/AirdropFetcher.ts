import {
  AddressSystemType,
  Airdrop,
  AirdropEnhanced,
  AirdropFetcherReport,
  AirdropFetcherResult,
  AirdropFetchersResult,
  AirdropItem,
  AirdropItemEnhanced,
  AirdropItemStatus,
  AirdropStatus,
  IsClaimed,
  NetworkIdType,
  PortfolioAssetGeneric,
  PortfolioAssetToken,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
  UsdValue,
  formatAddress,
  formatAddressByNetworkId,
  getAirdropItemStatus,
  getAirdropStatus,
  getIsEligible,
  getUsdValueSum,
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

export const airdropItemPriceCachePrefix = 'airdropitemprice';
export async function setAirdropItemPrices(
  params: {
    label: string;
    price: number;
  }[],
  networdkId: NetworkIdType,
  cache: Cache
) {
  await cache.setItems(
    params.map(({ label, price }) => ({
      key: label,
      value: price,
    })),
    {
      networkId: networdkId,
      prefix: airdropItemPriceCachePrefix,
    }
  );
}

async function getAirdropItemPrices(
  labels: string[],
  networdkId: NetworkIdType,
  cache: Cache
) {
  const pricesMap: Map<string, UsdValue> = new Map();
  if (labels.length === 0) return pricesMap;

  const prices = await cache.getItems<number>(labels, {
    networkId: networdkId,
    prefix: airdropItemPriceCachePrefix,
  });
  prices.forEach((p, i) => {
    pricesMap.set(labels[i], p || null);
  });
  return pricesMap;
}

async function getAirdropItemsPrices(
  airdrop: Airdrop,
  cache: Cache
): Promise<UsdValue[]> {
  const addresses: string[] = [];
  const labels: string[] = [];
  airdrop.items.forEach((i) => {
    if (i.address) addresses.push(i.address);
    else labels.push(i.label);
  });

  const [tokenPricesMap, pricesMap] = await Promise.all([
    cache.getTokenPricesAsMap(addresses, airdrop.networkId),
    getAirdropItemPrices(labels, airdrop.networkId, cache),
  ]);

  return airdrop.items.map((i) => {
    if (i.address) {
      const tPrice = tokenPricesMap.get(i.address);
      if (tPrice) return tPrice.price;
    }
    return pricesMap.get(i.label) || null;
  });
}

async function enhanceAirdrop(
  airdrop: Airdrop,
  cache: Cache
): Promise<AirdropEnhanced> {
  const airdropStatus = getAirdropStatus(airdrop.claimStart, airdrop.claimEnd);
  const prices = await getAirdropItemsPrices(airdrop, cache);
  return {
    ...airdrop,
    status: airdropStatus,
    items: airdrop.items.map((i, index) =>
      enhanceAirdropItem(i, airdropStatus, prices[index])
    ),
  };
}

function enhanceAirdropItem(
  airdropItem: AirdropItem,
  airdropStatus: AirdropStatus,
  price: UsdValue
): AirdropItemEnhanced {
  return {
    ...airdropItem,
    price,
    status: getAirdropItemStatus(
      airdropStatus,
      airdropItem.amount,
      airdropItem.isClaimed
    ),
  };
}

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

export type AirdropStatics = Omit<Airdrop, 'status' | 'items'>;

export function getAirdrop(params: {
  statics: AirdropStatics;
  items: {
    amount: number;
    label: string;
    imageUri?: string;
    address?: string;
    isClaimed: IsClaimed;
  }[];
}): Airdrop {
  return {
    ...params.statics,
    items: getAirdropItems(params.items),
  };
}

function getAirdropItems(
  items: {
    amount: number;
    label: string;
    imageUri?: string;
    address?: string;
    isClaimed: IsClaimed;
  }[]
): AirdropItem[] {
  return items.map((item) => {
    const isEligible = getIsEligible(item.amount);
    return {
      amount: item.amount,
      isClaimed: isEligible === false ? false : item.isClaimed,
      isEligible,
      label: item.label,
      address: item.address,
      imageUri: item.imageUri,
    };
  });
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

const airdropCachePrefix = 'airdropraw';
async function internalRunAirdropFetcher(
  owner: string,
  fetcher: AirdropFetcher,
  cache: Cache
) {
  const cachedAirdrop = await cache.getItem<Airdrop>(`${fetcher.id}_${owner}`, {
    prefix: airdropCachePrefix,
    networkId: fetcher.networkId,
  });
  if (cachedAirdrop) return enhanceAirdrop(cachedAirdrop, cache);
  const airdrop = await fetcher.executor(owner, cache);

  let ttl = 300000;
  if (airdrop.items.every((i) => i.isClaimed === true)) ttl = 172800000;

  await cache.setItem(`${fetcher.id}_${owner}`, airdrop, {
    ttl,
    prefix: airdropCachePrefix,
    networkId: fetcher.networkId,
  });
  return enhanceAirdrop(airdrop, cache);
}

export async function runAirdropFetcher(
  owner: string,
  fetcher: AirdropFetcher,
  cache: Cache
): Promise<AirdropFetcherResult> {
  const startDate = Date.now();
  const fOwner = formatAddressByNetworkId(owner, fetcher.networkId);
  const fetcherPromise = internalRunAirdropFetcher(owner, fetcher, cache).then(
    (airdrop): AirdropFetcherResult => {
      const now = Date.now();
      return {
        owner: fOwner,
        fetcherId: fetcher.id,
        networdkId: fetcher.networkId,
        duration: now - startDate,
        airdrop,
        date: now,
      };
    }
  );
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

      const { airdrop } = await runAirdropFetcher(owner, airdropFetcher, cache);

      const assets: (PortfolioAssetGeneric | PortfolioAssetToken)[] = [];
      airdrop.items.forEach((item) => {
        if (
          item.status !== AirdropItemStatus.claimable &&
          item.status !== AirdropItemStatus.claimableLater
        )
          return;

        const asset: PortfolioAssetGeneric | PortfolioAssetToken = item.address
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
              attributes: {
                isClaimable: true,
                lockedUntil: airdrop.claimStart,
              },
              value: item.price ? item.price * item.amount : null,
              imageUri: item.imageUri,
            };
        assets.push(asset);
      });

      if (assets.length === 0) return [];
      return [
        {
          networkId: airdropFetcher.networkId,
          label: 'Airdrop',
          data: {
            assets,
          },
          platformId,
          type: PortfolioElementType.multiple,
          value: getUsdValueSum(assets.map((a) => a.value)),
          name: airdrop.name || 'Airdrop',
        },
      ];
    },
  };
}
