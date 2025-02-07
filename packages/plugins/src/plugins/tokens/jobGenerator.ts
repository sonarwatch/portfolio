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
    console.log('starting');
    // await sleep(60000);
    console.log('sleep over');

    const tokenListResponse: AxiosResponse<UniTokenList> | null = await axios
      .get(network.tokenListUrl)
      .catch(() => null);
    console.log('got token list resp', tokenListResponse?.data.tokens);
    if (!tokenListResponse) return;
    const tokensData = getTokensData(tokenListResponse.data);

    console.log({ tokensData });
    console.log('fetched tokens data');
    tokenListResponse.data.tokens = []; // Free some RAM
    console.log('start shuffle');
    shuffleArray(tokensData);
    console.log('end shuffle');

    const setSourcesPromises: Promise<void>[] = [];
    while (tokensData.length !== 0) {
      console.log('bacth', tokensData.length);
      const currTokensDate = tokensData.splice(0, 100);
      const sources = await getCoingeckoSources(networkId, currTokensDate);
      setSourcesPromises.push(cache.setTokenPriceSources(sources));
    }
    console.log('the long wait');
    await Promise.all(setSourcesPromises);
  };
  return {
    executor,
    id: `${walletTokensPlatform.id}-${networkId}`,
    label: 'coingecko',
  };
}
