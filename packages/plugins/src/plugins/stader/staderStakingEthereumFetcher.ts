import { formatEvmAddress, PortfolioElement } from '@sonarwatch/portfolio-core';
import { Address } from 'viem';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { NETWORK_ID, platformId } from './constants';

import { Cache } from '../../Cache';
import { getEvmClient } from '../../utils/clients';
import {
  fetchStakedPermissionsLessNodeRegistry,
  generateMulticallInputForStakedCollateralPool,
  generateMulticallInputForStakedEthx,
  generateMulticallInputForStakedUtilityPool,
  processFetchStakedCollateralPoolResult,
  processFetchStakedEthxResult,
  processFetchStakedUtilityPoolResult,
} from './helper';
import { StaderFetcherParams } from './types';

const executor: FetcherExecutor = async (
  owner: string,
  cache: Cache
): Promise<PortfolioElement[]> => {
  const ownerAddress: Address = formatEvmAddress(owner) as Address;
  const logCtx = {
    fn: 'staderStakingEthereumFetcher::executor',
    ownerAddress,
    networkId: NETWORK_ID,
  };

  const client = getEvmClient(NETWORK_ID);
  const params: StaderFetcherParams = {
    cache,
    logCtx,
  };

  const multicallInputs = [
    generateMulticallInputForStakedEthx(ownerAddress),
    generateMulticallInputForStakedUtilityPool(ownerAddress),
    generateMulticallInputForStakedCollateralPool(ownerAddress),
  ] as const;

  const [permissionsLessNodeResult, multicallResults] = await Promise.all([
    fetchStakedPermissionsLessNodeRegistry(ownerAddress, params),
    client.multicall({ contracts: multicallInputs }),
  ]);

  const results = await Promise.all([
    permissionsLessNodeResult,
    processFetchStakedEthxResult(params, {
      input: multicallInputs[0],
      output: multicallResults[0],
    }),
    processFetchStakedUtilityPoolResult(params, {
      input: multicallInputs[1],
      output: multicallResults[1],
    }),
    processFetchStakedCollateralPoolResult(params, {
      input: multicallInputs[2],
      output: multicallResults[2],
    }),
  ]);

  return results.filter((r): r is PortfolioElement => !!r);
};

const fetcher: Fetcher = {
  id: `${platformId}-${NETWORK_ID}-staking`,
  networkId: NETWORK_ID,
  executor,
};

export default fetcher;
