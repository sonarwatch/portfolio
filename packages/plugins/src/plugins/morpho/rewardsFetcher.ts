import { EvmNetworkIdType, NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { Cache } from '../../Cache';

/* 
    As of April 2025, Morpho rewards are calculated off-chain.
    According to the Morpho team, the only way to access these rewards is 
    via the Morpho API, which is subject to a rate limit of 850 requests per minute.
    The exact formula used to compute rewards is currently closed-source, though the 
    team has expressed intentions to open-source it in the future.
*/

function getRewardsFetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    console.log(owner, cache);

    return [];
  };

  return {
    id: `${platformId}-${networkId}-rewards`,
    networkId: NetworkId.ethereum,
    executor,
  };
}

export default getRewardsFetcher;
