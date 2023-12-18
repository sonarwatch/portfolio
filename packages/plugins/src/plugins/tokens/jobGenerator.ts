import {
  NetworkIdType,
  UniTokenList,
  networks,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { getCoingeckoSources, getTokensData } from './helpers';
import { Cache } from '../../Cache';
import { Job } from '../../Job';
import sleep from '../../utils/misc/sleep';
import { walletTokensPlatform } from './constants';

export default function jobGenerator(networkId: NetworkIdType): Job {
  const network = networks[networkId];
  const executor = async (cache: Cache) => {
    await sleep(1000 * 60 * 10);
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
  return {
    executor,
    id: `${walletTokensPlatform.id}-${networkId}`,
  };
}
