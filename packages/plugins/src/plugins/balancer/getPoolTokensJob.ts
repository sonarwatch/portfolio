import { formatTokenAddress, networks } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Job, JobExecutor } from '../../Job';
import { BalancerSupportedEvmNetworkIdType, platformId } from './constants';
import { getBalancerPoolTokens } from './helpers/pools';
import { Cache } from '../../Cache';
import { tokenListInfoPrefix } from '../tokens/constants';

const ttl = 1000 * 60 * 60 * 24 * 7; // 7 days

export function getPoolTokensJob(
  networkId: BalancerSupportedEvmNetworkIdType
): Job {
  const executor: JobExecutor = async (cache: Cache) => {
    const poolTokensRes = await getBalancerPoolTokens(networkId);
    const balancerTokens = poolTokensRes.flatMap((pool) => pool.poolTokens);
    if (balancerTokens.length === 0) {
      return;
    }

    const uniqueTokens = Object.values(
      balancerTokens.reduce((acc, token) => {
        acc[token.address] = token;
        return acc;
      }, {} as Record<string, (typeof balancerTokens)[number]>)
    );

    const priceSources = uniqueTokens
      .filter((token) => {
        const balanceUSD = new BigNumber(token.balanceUSD);
        const balance = new BigNumber(token.balance);
        return (
          !balanceUSD.isZero() &&
          !balance.isZero() &&
          !balanceUSD.dividedBy(balance).isZero()
        );
      })
      .map((token) => {
        const balanceUSD = new BigNumber(token.balanceUSD);
        const balance = new BigNumber(token.balance);
        const price = Number(balanceUSD.dividedBy(balance).toNumber());
        return {
          address: formatTokenAddress(token.address, networkId),
          decimals: token.decimals,
          id: platformId,
          networkId,
          platformId,
          price,
          timestamp: Date.now(),
          weight: 0.5,
        };
      });

    const tokenMetaDataItems = uniqueTokens.map((balancerToken) => {
      const address = formatTokenAddress(balancerToken.address, networkId);
      return {
        key: address,
        value: {
          // simulate shape of tokenList response
          chainId: networks[networkId].chainId,
          address,
          decimals: balancerToken.decimals,
          name: balancerToken.name,
          symbol: balancerToken.symbol,
          logoURI: balancerToken.logoURI,
          extensions: { coingeckoId: balancerToken.coingeckoId },
        },
      };
    });

    await Promise.all([
      cache.setTokenPriceSources(priceSources),
      cache.setItems(tokenMetaDataItems, {
        prefix: tokenListInfoPrefix,
        networkId,
        ttl,
      }),
    ]);
  };
  return {
    id: `${platformId}-tokens-${networkId}`,
    executor,
    labels: ['normal'],
  };
}
