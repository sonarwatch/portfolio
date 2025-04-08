import axios from 'axios';
import { EvmNetworkIdType, formatEvmAddress } from '@sonarwatch/portfolio-core';
import { Address } from 'viem';
import { logger } from '@nx/devkit';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  PLATFORM_ID,
  SILOS_GRAPH_ENDPOINT_1,
  SILOS_GRAPH_ENDPOINT_2,
  SILOS_GRAPH_ENDPOINT_3,
  SILOS_VAULTS_KEY,
  SILOS_REWARD_VAULTS_KEY,
} from './constants';
import { SiloVaultsResponse } from './types';

const query = {
  query: `{
    silos {
      id
      totalValueLockedUSD
      totalBorrowBalanceUSD
      totalDepositBalanceUSD
      market {
        dToken {
          id
        }
        spToken {
          id
        }
        sToken {
          id
        }
      }
    }
    tokens {
      id
    }
  }`,
  variables: {},
};

async function fetchVaults(endpoint: string) {
  try {
    const { data: response } = await axios.post<{ data: SiloVaultsResponse }>(
      endpoint,
      query,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env['SUBGRAPH_API_KEY']}`,
        },
      }
    );

    // Process regular vaults
    const vaults = response.data.silos
      .filter(
        (silo) =>
          Number(silo.totalValueLockedUSD) > 0 ||
          Number(silo.totalBorrowBalanceUSD) > 0 ||
          Number(silo.totalDepositBalanceUSD) > 0
      )
      .map((silo) => formatEvmAddress(silo.id));

    // Process reward vaults
    const siloRewardAddresses = response.data.silos.flatMap((silo) =>
      silo.market.flatMap((market) => [
        formatEvmAddress(market.dToken.id),
        formatEvmAddress(market.spToken.id),
        formatEvmAddress(market.sToken.id),
      ])
    );
    const tokenAddresses = response.data.tokens.map((token) =>
      formatEvmAddress(token.id)
    );
    const rewardVaults = [...siloRewardAddresses, ...tokenAddresses];

    return {
      vaults,
      rewardVaults,
    };
  } catch (error) {
    logger.error(`Error fetching from ${endpoint}: ${error}`);
    return {
      vaults: [],
      rewardVaults: [],
    };
  }
}

export default function getSiloVaultsJob(networkId: EvmNetworkIdType): Job {
  const executor: JobExecutor = async (cache: Cache) => {
    // Fetch from all endpoints in parallel
    const [data1, data2, data3] = await Promise.all([
      fetchVaults(SILOS_GRAPH_ENDPOINT_1),
      fetchVaults(SILOS_GRAPH_ENDPOINT_2),
      fetchVaults(SILOS_GRAPH_ENDPOINT_3),
    ]);

    // Combine and deduplicate vaults
    const uniqueVaults = [
      ...new Set([...data1.vaults, ...data2.vaults, ...data3.vaults]),
    ] as Address[];

    // Combine and deduplicate reward vaults
    const uniqueRewardVaults = [
      ...new Set([
        ...data1.rewardVaults,
        ...data2.rewardVaults,
        ...data3.rewardVaults,
      ]),
    ] as Address[];

    // Cache both sets of data
    await Promise.all([
      cache.setItem(SILOS_VAULTS_KEY, uniqueVaults, {
        prefix: PLATFORM_ID,
        networkId,
      }),
      cache.setItem(SILOS_REWARD_VAULTS_KEY, uniqueRewardVaults, {
        prefix: PLATFORM_ID,
        networkId,
      }),
    ]);
  };

  return {
    id: `${PLATFORM_ID}-${networkId}-vaults`,
    executor,
    labels: ['normal'] as const,
  };
}
