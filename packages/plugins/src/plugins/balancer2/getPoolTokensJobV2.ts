import {
  NetworkId,
  formatTokenAddress,
  networks,
} from '@sonarwatch/portfolio-core';
import { Job, JobExecutor } from '../../Job';
import { platformId } from './constants';
import { getBalancerPoolTokens } from './helpers/pools';
import { Cache } from '../../Cache';
import { tokenListInfoPrefix } from '../tokens/constants';

const ttl = 1000 * 60 * 60 * 24 * 7; // 7 days

const executor: JobExecutor = async (cache: Cache) => {
  const poolTokensRes = await getBalancerPoolTokens(NetworkId.fraxtal);
  const balancerTokens = poolTokensRes
    .flatMap((pool) => pool.poolTokens)
    .map((balancerToken) => ({
      // simulate shape of tokenList response
      chainId: networks[NetworkId.fraxtal].chainId,
      address: balancerToken.address,
      decimals: balancerToken.decimals,
      name: balancerToken.name,
      symbol: balancerToken.symbol,
      logoURI: balancerToken.logoURI,
      extensions: { coingeckoId: balancerToken.coingeckoId },
    }));

  if (balancerTokens.length === 0) {
    return;
  }

  for (const token of balancerTokens) {
    const address = formatTokenAddress(token.address, NetworkId.fraxtal);
    const fToken = {
      ...token,
      address,
    };

    await cache.setItem(address, fToken, {
      prefix: tokenListInfoPrefix,
      networkId: NetworkId.fraxtal,
      ttl,
    });
  }
};
const job: Job = {
  id: `${platformId}-pool-tokens-v2`,
  executor,
  label: 'normal',
};
export default job;
