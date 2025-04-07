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
} from './constants';
import { SiloVaultResponse } from './types';

const query = {
  query: `{
  silos {
    id
    totalValueLockedUSD
    totalBorrowBalanceUSD
    totalDepositBalanceUSD
  }
}`,
  variables: {},
};

async function fetchVaults(endpoint: string) {
  try {
    const { data: response } = await axios.post<{ data: SiloVaultResponse }>(
      endpoint,
      query,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env['SUBGRAPH_API_KEY']}`,
        },
      }
    );
    return response.data.silos
      .filter(
        (silo) =>
          Number(silo.totalValueLockedUSD) > 0 ||
          Number(silo.totalBorrowBalanceUSD) > 0 ||
          Number(silo.totalDepositBalanceUSD) > 0
      )
      .map((silo) => formatEvmAddress(silo.id));
  } catch (error) {
    logger.error(`Error fetching from ${endpoint}: ${error}`);
    return [];
  }
}

export default function getSiloVaultsJob(networkId: EvmNetworkIdType): Job {
  const executor: JobExecutor = async (cache: Cache) => {
    // Fetch from all endpoints in parallel
    const [vaults1, vaults2, vaults3] = await Promise.all([
      fetchVaults(SILOS_GRAPH_ENDPOINT_1),
      fetchVaults(SILOS_GRAPH_ENDPOINT_2),
      fetchVaults(SILOS_GRAPH_ENDPOINT_3),
    ]);

    // Combine and deduplicate vaults
    const uniqueVaults = [
      ...new Set([...vaults1, ...vaults2, ...vaults3]),
    ] as Address[];

    logger.info(
      `Found ${uniqueVaults.length} ${PLATFORM_ID} vaults across all endpoints on ${networkId}`
    );

    // Cache the unique vaults
    await cache.setItem(SILOS_VAULTS_KEY, uniqueVaults, {
      prefix: PLATFORM_ID,
      networkId,
    });
  };

  return {
    id: `${PLATFORM_ID}-${networkId}-vaults`,
    executor,
    labels: [networkId] as const,
  };
}
