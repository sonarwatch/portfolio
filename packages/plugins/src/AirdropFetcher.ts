import {
  AddressSystemType,
  AirdropRaw,
  Airdrop,
  AirdropFetcherReport,
  AirdropFetcherResult,
  AirdropFetchersResult,
  AirdropItemRaw,
  AirdropItem,
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
  isEligibleAmount,
  getUsdValueSum,
  networks,
  compareName,
  formatTokenAddress,
  promiseTimeout,
} from '@sonarwatch/portfolio-core';
import { Cache } from './Cache';
import { Fetcher } from './Fetcher';
import tokenPriceToAssetToken from './utils/misc/tokenPriceToAssetToken';
import runInParallel from './utils/misc/runInParallel';

export type AirdropFetcherExecutor = (
  owner: string,
  cache: Cache
) => Promise<AirdropRaw>;

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
  networkId: NetworkIdType,
  cache: Cache
) {
  await cache.setItems(
    params.map(({ label, price }) => ({
      key: label,
      value: price,
    })),
    {
      networkId,
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
  airdrop: AirdropRaw,
  networkId: NetworkIdType,
  cache: Cache
): Promise<UsdValue[]> {
  const addresses: string[] = [];
  const labels: string[] = [];
  airdrop.items.forEach((i) => {
    if (i.address) addresses.push(i.address);
    else labels.push(i.label);
  });

  const [tokenPricesMap, pricesMap] = await Promise.all([
    cache.getTokenPricesAsMap(addresses, networkId),
    getAirdropItemPrices(labels, networkId, cache),
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
  airdropRaw: AirdropRaw,
  owner: string,
  networkId: NetworkIdType,
  cache: Cache
): Promise<Airdrop> {
  const airdropStatus = getAirdropStatus(
    airdropRaw.claimStart,
    airdropRaw.claimEnd
  );
  const prices = await getAirdropItemsPrices(airdropRaw, networkId, cache);
  const items = airdropRaw.items
    .map((i, index) =>
      enhanceAirdropItem(
        i,
        airdropRaw.id,
        airdropStatus,
        prices[index],
        owner,
        networkId
      )
    )
    .sort((a, b) => compareName(a.label, b.label));
  return {
    ...airdropRaw,
    owner,
    networkId,
    status: airdropStatus,
    items,
    value: getUsdValueSum(items.map((i) => i.value)),
  };
}

function enhanceAirdropItem(
  airdropItem: AirdropItemRaw,
  airdropId: string,
  airdropStatus: AirdropStatus,
  price: UsdValue,
  owner: string,
  networkId: NetworkIdType
): AirdropItem {
  return {
    ...airdropItem,
    address: airdropItem.address
      ? formatTokenAddress(airdropItem.address, networkId)
      : undefined,
    airdropId,
    price,
    status: getAirdropItemStatus(
      airdropStatus,
      airdropItem.amount,
      airdropItem.isClaimed
    ),
    value: price ? price * airdropItem.amount : null,
    owner,
  };
}

const runAirdropFetcherTimeout = 10000;

export async function runAirdropFetchersByNetworkId(
  owner: string,
  networkId: NetworkIdType,
  fetchers: AirdropFetcher[],
  cache: Cache,
  useCache = false
) {
  const isFetchersValids = fetchers.every((f) => f.networkId === networkId);
  if (!isFetchersValids)
    throw new Error(
      `Not all airdrop fetchers have the right network id: ${networkId}`
    );

  const { addressSystem } = networks[networkId];
  return runAirdropFetchers(owner, addressSystem, fetchers, cache, useCache);
}

export type AirdropStatics = Omit<AirdropRaw, 'status' | 'items'>;

export function getAirdropRaw(params: {
  statics: AirdropStatics;
  items: {
    amount: number;
    label: string;
    imageUri?: string;
    address?: string;
    isClaimed: IsClaimed;
  }[];
}): AirdropRaw {
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
): AirdropItemRaw[] {
  return items.map((item) => {
    const isEligible = isEligibleAmount(item.amount);
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
  cache: Cache,
  useCache = false
): Promise<AirdropFetchersResult> {
  const startDate = Date.now();
  const fOwner = formatAddress(owner, addressSystem);
  const isFetchersValids = fetchers.every(
    (f) => networks[f.networkId].addressSystem === addressSystem
  );
  if (!isFetchersValids)
    throw new Error(
      `Not all fetchers have the right address system: ${addressSystem}`
    );

  const result = await runInParallel(
    fetchers.map((f) => () => runAirdropFetcher(fOwner, f, cache, useCache)),
    5
  );

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
  const now = Date.now();
  return {
    date: now,
    owner: fOwner,
    addressSystem,
    fetcherReports: fReports,
    airdrops,
    duration: now - startDate,
  };
}

const airdropCachePrefix = 'airdropraw';
async function internalRunAirdropFetcher(
  owner: string,
  fetcher: AirdropFetcher,
  cache: Cache,
  useCache = false
) {
  if (useCache) {
    const cAirdropRaw = await cache.getItem<AirdropRaw>(
      `${fetcher.id}_${owner}`,
      {
        prefix: airdropCachePrefix,
        networkId: fetcher.networkId,
      }
    );
    if (cAirdropRaw)
      return enhanceAirdrop(cAirdropRaw, owner, fetcher.networkId, cache);
  }
  const airdrop = await fetcher.executor(owner, cache);

  if (useCache) {
    // TTL is 120000 ms (2min)
    // If ineligible or claimed 240000 ms (4min)
    // If not claimable yet 240000 ms (4min) or until claim start
    let ttl = 120000;
    const now = Date.now();
    if (airdrop.items.every((i) => !isEligibleAmount(i.amount))) ttl = 240000;
    else if (airdrop.items.every((i) => i.isClaimed === true)) ttl = 240000;
    else if (airdrop.claimStart && airdrop.claimStart > now) {
      ttl = Math.min(240000, airdrop.claimStart - now);
    }
    await cache.setItem<AirdropRaw>(`${fetcher.id}_${owner}`, airdrop, {
      ttl,
      prefix: airdropCachePrefix,
      networkId: fetcher.networkId,
    });
  }

  return enhanceAirdrop(airdrop, owner, fetcher.networkId, cache);
}

export async function runAirdropFetcher(
  owner: string,
  fetcher: AirdropFetcher,
  cache: Cache,
  useCache = false
): Promise<AirdropFetcherResult> {
  const startDate = Date.now();
  const fOwner = formatAddressByNetworkId(owner, fetcher.networkId);
  const fetcherPromise = internalRunAirdropFetcher(
    owner,
    fetcher,
    cache,
    useCache
  ).then((airdrop): AirdropFetcherResult => {
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
  claimEnd?: number,
  useCache = false
): Fetcher {
  return {
    id,
    networkId: airdropFetcher.networkId,
    executor: async (
      owner: string,
      cache: Cache
    ): Promise<PortfolioElementMultiple[]> => {
      if (claimEnd && Date.now() > claimEnd) return [];

      const { airdrop } = await runAirdropFetcher(
        owner,
        airdropFetcher,
        cache,
        useCache
      );

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
              { isClaimable: true, lockedUntil: airdrop.claimStart },
              airdrop.claimLink
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
              value: item.value,
              imageUri: item.imageUri,
              link: airdrop.claimLink,
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
