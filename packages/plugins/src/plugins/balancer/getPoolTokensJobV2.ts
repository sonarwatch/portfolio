import { Job, JobExecutor } from '../../Job';
import { balancerApiNetworkByNetworkId, platformId } from './constants';

const executor: JobExecutor = async () => {
  for (const x of Object.entries(balancerApiNetworkByNetworkId)) {
    console.log(x);
  }
  // const network = networks[networkId];
  // const tokenList: AxiosResponse<UniTokenList> | null = await axios
  //   .get(network.tokenListUrl)
  //   .catch(() => null);
  // if (!tokenList) return;

  // for (let i = 0; i < tokenList.data.tokens.length; i++) {
  //   const token = tokenList.data.tokens[i];
  //   const address = formatTokenAddress(token.address, networkId);
  //   const fToken = {
  //     ...token,
  //     address,
  //   };
  //   await cache.setItem(address, fToken, {
  //     prefix: CACHE_KEYS.TOKEN_LIST_INFO_PREFIX,
  //     networkId,
  //     ttl,
  //   });
  // }
  // await cache.setItem(networkId, tokenList.data, {
  //   prefix: tokenListsPrefix,
  //   ttl,
  // });
};
const job: Job = {
  id: `${platformId}-pool-tokens-v2`,
  executor,
  label: 'normal',
};
export default job;
