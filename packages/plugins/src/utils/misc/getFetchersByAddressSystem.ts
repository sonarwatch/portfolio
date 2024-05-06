import {
  AddressSystem,
  AddressSystemType,
  NetworkIdType,
  getAddressSystemFromNetworkId,
} from '@sonarwatch/portfolio-core';

export function getFetchersByAddressSystem<
  T extends { networkId: NetworkIdType }
>(fetchers: Array<T>) {
  const fetchersByAddressSystem: Record<string, T[]> = {};
  Object.values(AddressSystem).forEach((addressSystem) => {
    fetchersByAddressSystem[addressSystem] = [];
  });
  fetchers.forEach((f) => {
    const addressSystem = getAddressSystemFromNetworkId(f.networkId);
    fetchersByAddressSystem[addressSystem].push(f);
  });
  return fetchersByAddressSystem as Record<AddressSystemType, T[]>;
}
