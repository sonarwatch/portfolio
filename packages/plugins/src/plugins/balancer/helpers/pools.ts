import request, { gql } from 'graphql-request';
import BigNumber from 'bignumber.js';
import { OwnerPoolApiResponse, PoolTokenApiResponse } from '../types';
import {
  BalancerSupportedEvmNetworkIdType,
  balancerApiNetworkByNetworkId,
  balancerApiUrl,
} from '../constants';

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
export async function getBalancerPoolTokens(
  networkId: BalancerSupportedEvmNetworkIdType
): Promise<PoolTokenApiResponse[]> {
  const balancerApiNetwork = balancerApiNetworkByNetworkId[networkId];
  const query = gql`
    query {
      poolGetPools(
        where: {
          chainIn: [${balancerApiNetwork}],
        },
        orderBy: totalLiquidity,
        first: 10000
      ) {
        poolTokens {
          address
          symbol
          name
          logoURI
          decimals
          coingeckoId
          balance
          balanceUSD
        }
      }
    }
  `;

  try {
    const res = await request<{ poolGetPools: PoolTokenApiResponse[] }>(
      balancerApiUrl,
      query
    );
    const pools = res.poolGetPools;

    return pools;
  } catch (error) {
    const msg = 'Cannot get Balancer pool tokens';
    console.error(msg, error);
    throw new Error(msg);
  }
}
