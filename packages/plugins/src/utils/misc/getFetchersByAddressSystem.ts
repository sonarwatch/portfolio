import {
  AddressSystem,
  AddressSystemType,
  getAddressSystemFromNetworkId,
} from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';

export function getFetchersByAddressSystem(fetchers: Fetcher[]) {
  const fetchersByAddressSystem: Record<string, Fetcher[]> = {};
  Object.values(AddressSystem).forEach((addressSystem) => {
    fetchersByAddressSystem[addressSystem] = [];
  });
  fetchers.forEach((f) => {
    const addressSystem = getAddressSystemFromNetworkId(f.networkId);
    fetchersByAddressSystem[addressSystem].push(f);
  });
  return fetchersByAddressSystem as Record<AddressSystemType, Fetcher[]>;
}
