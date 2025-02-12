import {
  NetworkIdType,
  UniTokenList,
  networks,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { tokenListsPrefix } from './constants';
import { isLatestVersion } from './helpers';

const ttl = 1000 * 60 * 60 * 24 * 7; // 7 days

function getTokenListsJob(networkId: NetworkIdType): Job {
  const executor: JobExecutor = async (cache: Cache) => {
    const network = networks[networkId];
    const tokenList: AxiosResponse<UniTokenList> | null = await axios
      .get(network.tokenListUrl)
      .catch(() => null);
    if (!tokenList) return;
    const cachedTokenList = await cache.getItem<UniTokenList>(networkId, {
      prefix: tokenListsPrefix,
    });

    // if (
    //   cachedTokenList &&
    //   !isLatestVersion(cachedTokenList.version, tokenList.data.version)
    // ) {
    //   return;
    // }

    // for (let i = 0; i < tokenList.data.tokens.length; i++) {
    //   const token = tokenList.data.tokens[i];
    //   const address = formatTokenAddress(token.address, networkId);
    //   const fToken = {
    //     ...token,
    //     address,
    //   };
    //   await cache.setItem(address, fToken, {
    //     prefix: tokenListsDetailsPrefix,
    //     networkId,
    //     ttl,
    //   });
    // }

    console.log(tokenList.data.tokens);
    await cache.setItem(networkId, tokenList.data, {
      prefix: tokenListsPrefix,
      ttl,
    });
  };
  const job: Job = {
    id: `token-lists-${networkId}`,
    executor,
    label: 'normal',
  };
  return job;
}
export default getTokenListsJob;
