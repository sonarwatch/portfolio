import { PortfolioElement } from '@sonarwatch/portfolio-core';
import { getAddress } from 'viem';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { NETWORK_ID, platformId } from './constants';

import { Cache } from '../../Cache';
import { getEvmClient } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import {
  fetchStakedPermissionsLessNodeRegistry,
  generateReadContractParamsForStakedCollateralPool,
  generateReadContractParamsForStakedEthx,
  generateReadContractParamsForStakedUtilityPool,
  processFetchStakedCollateralPoolResult,
  processFetchStakedEthxResult,
  processFetchStakedUtilityPoolResult,
} from './helper';
import { StaderFetcherParams } from './types';

const executor: FetcherExecutor = async (
  owner: string,
  cache: Cache
): Promise<PortfolioElement[]> => {
  const ownerAddress = getAddress(owner);
  const logCtx = {
    fn: 'staderStakingEthereumFetcher::executor',
    ownerAddress,
    networkId: NETWORK_ID,
  };

  const client = getEvmClient(NETWORK_ID);
  const elementRegistry = new ElementRegistry(NETWORK_ID, platformId);
  const params: StaderFetcherParams = {
    elementRegistry,
    logCtx,
  };

  const multicallInputs = [
    generateReadContractParamsForStakedEthx(ownerAddress),
    generateReadContractParamsForStakedUtilityPool(ownerAddress),
    generateReadContractParamsForStakedCollateralPool(ownerAddress),
  ] as const;

  const [permissionsLessNodeResult, multicallResults] = await Promise.all([
    fetchStakedPermissionsLessNodeRegistry(ownerAddress, params),
    client.multicall({ contracts: multicallInputs }),
  ]);

  await Promise.all([
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

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-${NETWORK_ID}-staking`,
  networkId: NETWORK_ID,
  executor,
};

export default fetcher;
