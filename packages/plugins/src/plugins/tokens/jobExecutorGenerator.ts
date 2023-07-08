import {
  Cache,
  JobExecutor,
  NetworkIdType,
  UniTokenList,
  networks,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { getCoingeckoSources, getTokensData } from './helpers';

export default function jobExecutorGenerator(
  networkId: NetworkIdType
): JobExecutor {
  const network = networks[networkId];
  return async (cache: Cache) => {
    const tokenListResponse: AxiosResponse<UniTokenList> | null = await axios
      .get(network.tokenListUrl)
      .catch(() => null);
    if (!tokenListResponse) return;

    const tokensData = await getTokensData(tokenListResponse.data);
    const sources = await getCoingeckoSources(networkId, tokensData);
    for (let i = 0; i < sources.length; i += 1) {
      const source = sources[i];
      await cache.setTokenPriceSource(source);
    }
  };
}
