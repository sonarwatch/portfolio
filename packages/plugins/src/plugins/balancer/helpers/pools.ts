import request, { gql } from 'graphql-request';
import BigNumber from 'bignumber.js';
import { OwnerPoolApiResponse } from '../types';
import {
  BalancerSupportedEvmNetworkIdType,
  balancerApiNetworkByNetworkId,
  balancerApiUrl,
} from '../constants';

export async function getPoolPositionsForOwnerV2(
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
    console.error('Error fetching Balancer pools:', error);
    return [];
  }
}
