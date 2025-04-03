import {
  ethereumNativeAddress,
  formatEvmAddress,
  NetworkId,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';
import { Address } from 'viem';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  CONTRACT_ADDRESS_ETHX_TOKEN_ETHEREUM_MAINNET,
  CONTRACT_ADDRESS_PERMISSIONLESS_NODE_REGISTRY_ETHEREUM_MAINNET,
  CONTRACT_ADDRESS_STADER_COLLATERAL_POOL_ETHEREUM_MAINNET,
  CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET,
  CONTRACT_ADDRESS_STADER_UTILITY_POOL_ETHEREUM_MAINNET,
  DECIMALS_ON_CONTRACT_STADER_TOKEN,
  platformId,
} from './constants';

import { Cache } from '../../Cache';
import { getEvmClient } from '../../utils/clients';
import { getBalances } from '../../utils/evm/getBalances';
import { createStakedPortfolioElement } from '../../utils/octav/createStakedPortfolioElement';
import { extractMulticallResult } from '../../utils/octav/extractMulticallResult';
import { verboseLog } from '../../utils/octav/loggingUtils';
import { convertBigIntToNumber } from '../../utils/octav/tokenFactor';
import { wrapReadContractCall } from '../../utils/octav/wrapReadContractCall';
import {
  permissionsLessNodeRegistryAbi,
  sdCollateralPoolAbi,
  sdUtilityPoolAbi,
} from './abis';
import { StaderFetcherParams, StaderFetchFunction } from './types';

const NETWORK_ID = NetworkId.ethereum;

const fetchStakedEthx: StaderFetchFunction = async ({
  owner,
  cache,
  logCtx,
}) => {
  const contractAddress = CONTRACT_ADDRESS_ETHX_TOKEN_ETHEREUM_MAINNET;

  const contractsToFetchBalanceFor = [contractAddress];

  verboseLog(
    { ...logCtx, contractsToFetchBalanceFor },
    'Fetching stader ethx balances'
  );

  const balances = await getBalances(
    owner,
    contractsToFetchBalanceFor,
    NETWORK_ID
  );

  verboseLog({ ...logCtx, balances }, 'Balances retrieved');

  const rawBalance0 = balances.at(0)?.toString();
  if (!rawBalance0) {
    return undefined;
  }

  const amount = convertBigIntToNumber(
    rawBalance0,
    DECIMALS_ON_CONTRACT_STADER_TOKEN
  );

  return createStakedPortfolioElement(
    platformId,
    NETWORK_ID,
    contractAddress,
    contractAddress,
    amount,
    cache,
    logCtx
  );
};

const fetchStakedPermissionsLessNodeRegistry: StaderFetchFunction = async ({
  owner,
  cache,
  logCtx,
}): Promise<PortfolioElement | undefined> => {
  const contractAddress =
    CONTRACT_ADDRESS_PERMISSIONLESS_NODE_REGISTRY_ETHEREUM_MAINNET;

  const client = getEvmClient(NETWORK_ID);

  const [operatorIDByAddressResult, getCollateralETHResult] =
    await client.multicall({
      contracts: [
        {
          abi: permissionsLessNodeRegistryAbi,
          address: contractAddress,
          functionName: 'operatorIDByAddress',
          args: [owner],
        } as const,
        {
          abi: permissionsLessNodeRegistryAbi,
          address: contractAddress,
          functionName: 'getCollateralETH',
        } as const,
      ],
    });

  const operatorId = extractMulticallResult(operatorIDByAddressResult, {
    functionName: 'operatorIDByAddress',
    logCtx,
  });
  if (!operatorId) {
    return undefined;
  }

  const rawCollateralEth = extractMulticallResult(getCollateralETHResult, {
    functionName: 'getCollateralETH',
    logCtx,
  });
  if (!rawCollateralEth) {
    return undefined;
  }

  const collateralEth = convertBigIntToNumber(
    rawCollateralEth,
    DECIMALS_ON_CONTRACT_STADER_TOKEN
  );

  const operatorTotalKeys = await wrapReadContractCall(
    client,
    {
      abi: permissionsLessNodeRegistryAbi,
      address: contractAddress,
      functionName: 'getOperatorTotalKeys',
      args: [operatorId],
    },
    {
      logCtx,
    }
  );

  if (!operatorTotalKeys) {
    return undefined;
  }

  return createStakedPortfolioElement(
    platformId,
    NETWORK_ID,
    contractAddress,
    ethereumNativeAddress,
    Number(operatorTotalKeys) * collateralEth,
    cache,
    logCtx
  );
};

const fetchStakedUtilityPool: StaderFetchFunction = async ({
  owner,
  cache,
  logCtx,
}): Promise<PortfolioElement | undefined> => {
  const contractAddress = CONTRACT_ADDRESS_STADER_UTILITY_POOL_ETHEREUM_MAINNET;

  const client = getEvmClient(NETWORK_ID);
  const rawLatestSDBalance = await wrapReadContractCall(
    client,
    {
      abi: sdUtilityPoolAbi,
      address: contractAddress,
      functionName: 'getDelegatorLatestSDBalance',
      args: [owner],
    },
    {
      logCtx,
    }
  );

  if (!rawLatestSDBalance) {
    return undefined;
  }

  const latestSDBalance = convertBigIntToNumber(
    rawLatestSDBalance,
    DECIMALS_ON_CONTRACT_STADER_TOKEN
  );

  return createStakedPortfolioElement(
    platformId,
    NETWORK_ID,
    contractAddress,
    CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET,
    latestSDBalance,
    cache,
    logCtx
  );
};

const fetchStakedCollateralPool: StaderFetchFunction = async ({
  owner,
  cache,
  logCtx,
}): Promise<PortfolioElement | undefined> => {
  const contractAddress =
    CONTRACT_ADDRESS_STADER_COLLATERAL_POOL_ETHEREUM_MAINNET;

  const client = getEvmClient(NETWORK_ID);
  const rawCollateralBalance = await wrapReadContractCall(
    client,
    {
      abi: sdCollateralPoolAbi,
      address: contractAddress,
      functionName: 'operatorSDBalance',
      args: [owner],
    },
    {
      logCtx,
    }
  );

  if (!rawCollateralBalance) {
    return undefined;
  }

  const collateralBalance = convertBigIntToNumber(
    rawCollateralBalance,
    DECIMALS_ON_CONTRACT_STADER_TOKEN
  );

  return createStakedPortfolioElement(
    platformId,
    NETWORK_ID,
    contractAddress,
    CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET,
    collateralBalance,
    cache,
    logCtx
  );
};

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

  const params: StaderFetcherParams = {
    owner: ownerAddress,
    cache,
    logCtx,
  };

  const fetchFunctions: StaderFetchFunction[] = [
    fetchStakedEthx,
    fetchStakedPermissionsLessNodeRegistry,
    fetchStakedUtilityPool,
    fetchStakedCollateralPool,
  ];

  const results = await Promise.all(
    fetchFunctions.map((fetchFn) => fetchFn(params))
  );

  return results.filter(
    (element): element is PortfolioElement => element !== undefined
  );
};

const fetcher: Fetcher = {
  id: `${platformId}-${NETWORK_ID}-staking`,
  networkId: NETWORK_ID,
  executor,
};

export default fetcher;
