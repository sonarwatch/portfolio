import {
  UniTokenList,
  formatTokenAddress,
  networks,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { tokenListsDetailsPrefix, tokenListsPrefix } from './constants';
import { isLatestVersion } from './helpers';

const ttl = 1000 * 60 * 60 * 24; // 1 day

const executor: JobExecutor = async (cache: Cache) => {
  for (const network of Object.values(networks)) {
    const tokenList: AxiosResponse<UniTokenList> | null = await axios
      .get(network.tokenListUrl)
      .catch(() => null);
    if (!tokenList) continue;
    const cachedTokenList = await cache.getItem<UniTokenList>(network.id, {
      prefix: tokenListsPrefix,
    });

    if (
      cachedTokenList &&
      isLatestVersion(cachedTokenList.version, tokenList.data.version)
    ) {
      continue;
    }

    for (let i = 0; i < tokenList.data.tokens.length; i++) {
      const token = tokenList.data.tokens[i];
      const address = formatTokenAddress(token.address, network.id);
      const fToken = {
        ...token,
        address,
      };
      await cache.setItem(address, fToken, {
        prefix: tokenListsDetailsPrefix,
        networkId: network.id,
        ttl,
      });
    }
    await cache.setItem(network.id, tokenList.data, {
      prefix: tokenListsPrefix,
      ttl,
    });
  }
};

const job: Job = {
  id: 'token-lists',
  executor,
};
export default job;
