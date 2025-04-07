import { EvmNetworkIdType, ProxyInfo } from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import { Cache } from '../../Cache';
import { fetchLendingForAddress } from './helpers';
import { Fetcher } from '../../Fetcher';
import { getDSA } from '../../utils/evm/getDSA';
import { fetchLendingForAddressV3 } from './helpersV3';
import { LendingConfig } from './types';
import { combinedLendingConfigs } from './constants';

export default function getLendingFetcher(
  networkId: EvmNetworkIdType,
  platformId: string,
  version: LendingConfig['version']
): Fetcher {
  const executor = async (owner: string, cache: Cache) => {
    const instadappDSA = getDSA(networkId);
    const addresses = [getAddress(owner)];

    const accounts = await instadappDSA.getAccounts(owner);
    const accountsAddresses = accounts.map((acc) => getAddress(acc.address));
    addresses.push(...accountsAddresses);

    const configs = combinedLendingConfigs
      .get(networkId)
      ?.filter((c) => c.version === version);
    if (!configs) return [];

    const promises = addresses.map((address, i) => {
      let proxyInfo: ProxyInfo | undefined;
      if (i > 0) proxyInfo = { address, id: 'instadapp' };
      if (version === 3) {
        return fetchLendingForAddressV3(
          address,
          networkId,
          configs,
          cache,
          platformId,
          proxyInfo
        );
      }
      return fetchLendingForAddress(
        address,
        networkId,
        configs,
        cache,
        platformId,
        proxyInfo
      );
    });
    const elements = (await Promise.all(promises)).flat(1);
    return elements;
  };

  return {
    id: `${platformId}-${networkId}-lending`,
    networkId,
    executor,
  };
}
