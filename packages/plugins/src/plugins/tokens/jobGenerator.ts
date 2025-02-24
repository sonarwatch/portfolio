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
import shuffleArray from '../../utils/misc/shuffleArray';

export default function jobGenerator(networkId: NetworkIdType): Job {
  const network = networks[networkId];
  const executor = async (cache: Cache) => {
    await sleep(60000);
    const tokenListResponse: AxiosResponse<UniTokenList> | null = await axios
      .get(network.tokenListUrl)
      .catch(() => null);
    if (!tokenListResponse) return;
    const tokensData = getTokensData(tokenListResponse.data);
    tokenListResponse.data.tokens = []; // Free some RAM
    shuffleArray(tokensData);

    const setSourcesPromises: Promise<void>[] = [];
    while (tokensData.length !== 0) {
      const currTokensDate = tokensData.splice(0, 100);
      const sources = await getCoingeckoSources(networkId, currTokensDate);
      setSourcesPromises.push(cache.setTokenPriceSources(sources));
    }
    await Promise.all(setSourcesPromises);
  };
  return {
    executor,
    id: `${walletTokensPlatform.id}-${networkId}`,
    labels: ['coingecko'],
  };
}
