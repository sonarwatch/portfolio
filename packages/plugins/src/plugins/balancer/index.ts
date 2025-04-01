import { NetworkId } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import getBalancerPoolTokensJob from './getPoolTokensMetadataJob';
import getPoolPositionsFetcher from './getPoolPositionsFetcher';

export const jobs: Job[] = [getBalancerPoolTokensJob];

export async function getPoolPositionsForOwner(
  owner: string,
  networkId: BalancerSupportedEvmNetworkIdType
): Promise<OwnerPoolApiResponse[]> {
  const balancerApiNetwork = balancerApiNetworkByNetworkId[networkId];
  const query = gql`
    query {
      poolGetPools(
        where: {
          chainIn: [${balancerApiNetwork}],
          userAddress: "${owner}"
        }
      ) {
        address
        name
        symbol
        type
        dynamicData {
          totalShares
          totalLiquidity
        }
        poolTokens {
          address
          symbol
          name
          balance
          logoURI
          decimals
          balanceUSD
        }
        staking {
          address
          gauge {
            gaugeAddress
          }
        }
        userBalance {
          stakedBalances {
            stakingType
            stakingId
            balance
            balanceUsd
          }
          totalBalance
        }
      }
    }
  `;

  try {
    const res = await request<{ poolGetPools: OwnerPoolApiResponse[] }>(
      balancerApiUrl,
      query
    );
    const pools = res.poolGetPools;
    if (!pools || !pools.length) return [];

    const sortedPools = pools.sort((a, b) => {
      const liquidityA = new BigNumber(a.dynamicData.totalLiquidity);
      const liquidityB = new BigNumber(b.dynamicData.totalLiquidity);
      return liquidityB.minus(liquidityA).toNumber(); // Sort high to low
    });

    return sortedPools;
  } catch (error) {
    const msg = 'Cannot get Balancer pools';
    console.error(msg, error);
    return [];
  }
}

export const fetchers: Fetcher[] = [
  getPoolPositionsFetcher(NetworkId.ethereum),
  getPoolPositionsFetcher(NetworkId.avalanche),
  getPoolPositionsFetcher(NetworkId.polygon),
  getPoolPositionsFetcher(NetworkId.fraxtal),
];
