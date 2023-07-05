import {
  JobExecutor,
  NetworkId,
  UniTokenList,
  getCache,
  solanaNetwork,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { TokenData } from '../types';
import { getCoingeckoSources } from '../helpers';

const jobExecutor: JobExecutor = async () => {
  const cache = getCache();

  const tokenListResponse: AxiosResponse<UniTokenList> | null = await axios
    .get(solanaNetwork.tokenListUrl)
    .catch(() => null);
  if (!tokenListResponse) return;

  const tokensData = tokenListResponse.data.tokens.reduce(
    (cTokensData: TokenData[], ti) => {
      if (!ti.extensions) return cTokensData;
      const { coingeckoId } = ti.extensions;
      if (typeof coingeckoId !== 'string') return cTokensData;

      const tokenData: TokenData = {
        address: ti.address,
        coingeckoId,
        decimals: ti.decimals,
        isBase: true,
      };
      cTokensData.push(tokenData);
      return cTokensData;
    },
    []
  );

  const sources = await getCoingeckoSources(NetworkId.solana, tokensData);
  for (let i = 0; i < sources.length; i += 1) {
    const source = sources[i];
    await cache.setTokenPriceSource(source);
  }
};
export default jobExecutor;
