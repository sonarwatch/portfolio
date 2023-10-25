import { EvmNetworkIdType, ProxyInfo } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { fetchLendingForAddress } from './helpers';
import { FetcherExecutor } from '../../Fetcher';
import { lendingConfigs } from './constants';
import { getDSA } from '../../utils/evm/getDSA';

export default function getLendingFetcherExecutor(
  networkId: EvmNetworkIdType
): FetcherExecutor {
  return async (owner: string, cache: Cache) => {
    const instadappDSA = getDSA(networkId);
    const addresses = [owner];

    const accounts = await instadappDSA.getAccounts(owner);
    const accountsAddresses = accounts.map((acc) => acc.address);
    addresses.push(...accountsAddresses);

    const configs = lendingConfigs.get(networkId);
    if (!configs) return [];

    const promises = addresses.map((address, i) => {
      let proxyInfo: ProxyInfo | undefined;
      if (i > 0) proxyInfo = { address, id: 'instadapp' };
      return fetchLendingForAddress(
        address,
        networkId,
        configs,
        cache,
        proxyInfo
      );
    });
    const elements = (await Promise.all(promises)).flat(1);
    return elements;
  };
}
