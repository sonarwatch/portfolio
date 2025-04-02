import {
  ethereumNativeAddress,
  formatEvmAddress,
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
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
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { LoggingContext, verboseLog } from '../octav/utils/loggingUtils';
import { permissionsLessNodeRegistryAbi, sdCollateralPoolAbi, sdUtilityPoolAbi } from './abis';

const DECIMALS_ON_CONTRACT = 18;
const NETWORK_ID = NetworkId.ethereum;

const fetchStakedEthx = async (
  owner: Address,
  cache: Cache,
  logCtx: LoggingContext
): Promise<PortfolioElement | undefined> => {
  const contractsToFetchBalanceFor = [
    CONTRACT_ADDRESS_ETHX_TOKEN_ETHEREUM_MAINNET,
  ];

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

  const contractAddress = contractsToFetchBalanceFor[0];
  const contractDecimals = DECIMALS_ON_CONTRACT;
  const amount = new BigNumber(rawBalance0)
    .div(10 ** contractDecimals)
    .toNumber();

  const tokenPrice = await cache.getTokenPrice(contractAddress, NETWORK_ID);

  verboseLog(
    { ...logCtx, contractAddress, tokenPrice },
    'Token price retrieved from cache'
  );

  const stakedAsset = tokenPriceToAssetToken(
    contractAddress,
    amount,
    NETWORK_ID,
    tokenPrice
  );

  return {
    networkId: NETWORK_ID,
    label: 'Staked',
    platformId,
    type: PortfolioElementType.multiple,
    value: stakedAsset.value,
    data: {
      assets: [stakedAsset],
    },
  };
};

const fetchStakedPermissionsLessNodeRegistry = async (
  owner: Address,
  cache: Cache,
  logCtx: LoggingContext
): Promise<PortfolioElement | undefined> => {
  const contractAddress =
    CONTRACT_ADDRESS_PERMISSIONLESS_NODE_REGISTRY_ETHEREUM_MAINNET;
  const contractDecimals = DECIMALS_ON_CONTRACT;

  const client = getEvmClient(NETWORK_ID);
  verboseLog({ ...logCtx, contractAddress }, 'Fetching operatorId');
  const operatorId = await client.readContract({
    abi: permissionsLessNodeRegistryAbi,
    address: contractAddress,
    functionName: 'operatorIDByAddress',
    args: [owner],
  });
  verboseLog(
    { ...logCtx, operatorId },
    'Call to operatorIDByAddress completed'
  );
  if (!operatorId) {
    verboseLog(logCtx, 'No operatorId found; bailing out');
    return;
  }

  verboseLog(
    { ...logCtx, operatorId, contractAddress },
    'Fetching operatorTotalKeys for operatorId'
  );
  const operatorTotalKeys = await client.readContract({
    abi: permissionsLessNodeRegistryAbi,
    address: contractAddress,
    functionName: 'getOperatorTotalKeys',
    args: [operatorId],
  });
  verboseLog(
    { ...logCtx, operatorTotalKeys },
    'Call to getOperatorTotalKeys completed'
  );
  if (!operatorTotalKeys) {
    verboseLog(logCtx, 'No operatorTotalKeys found; bailing out');
    return;
  }

  // Now that we have the operatorTotalKeys, we must multiply it by the pool's collateralETH
  const rawCollateralEth = await client.readContract({
    abi: permissionsLessNodeRegistryAbi,
    address: contractAddress,
    functionName: 'getCollateralETH',
  });
  verboseLog(
    { ...logCtx, rawCollateralEth },
    'Call to getCollateralETH completed'
  );
  if (!rawCollateralEth) {
    throw new Error('Call to getCollateralETH returned no value');
  }

  const collateralEth = new BigNumber(rawCollateralEth.toString())
    .div(10 ** contractDecimals)
    .toNumber();

  // We must get the price of ETH
  const contractAddressForEth = ethereumNativeAddress;
  const tokenPrice = await cache.getTokenPrice(
    contractAddressForEth,
    NETWORK_ID
  );

  verboseLog(
    { ...logCtx, contractAddressForEth, tokenPrice },
    'Token price retrieved from cache'
  );

  const stakedAsset = tokenPriceToAssetToken(
    contractAddress,
    Number(operatorTotalKeys) * collateralEth,
    NETWORK_ID,
    tokenPrice
  );

  return {
    networkId: NETWORK_ID,
    label: 'Staked',
    platformId,
    type: PortfolioElementType.multiple,
    value: stakedAsset.value,
    data: {
      assets: [stakedAsset],
    },
  };
};

const fetchStakedUtilityPool = async (
  owner: Address,
  cache: Cache,
  logCtx: LoggingContext
): Promise<PortfolioElement | undefined> => {
  const contractAddress = CONTRACT_ADDRESS_STADER_UTILITY_POOL_ETHEREUM_MAINNET;
  const contractDecimals = DECIMALS_ON_CONTRACT_STADER_TOKEN;

  const client = getEvmClient(NETWORK_ID);
  verboseLog({ ...logCtx, contractAddress }, 'Fetching stader utility pool');

  const rawLatestSDBalance = await client.readContract({
    abi: sdUtilityPoolAbi,
    address: contractAddress,
    functionName: 'getDelegatorLatestSDBalance',
    args: [owner],
  });
  verboseLog(
    { ...logCtx, rawLatestSDBalance },
    'Call to getDelegatorLatestSDBalance completed'
  );
  if (!rawLatestSDBalance) {
    verboseLog(logCtx, 'No latestSDBalance found; bailing out');
    return;
  }

  const latestSDBalance = new BigNumber(rawLatestSDBalance.toString())
    .div(10 ** contractDecimals)
    .toNumber();

  const tokenPrice = await cache.getTokenPrice(
    CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET,
    NETWORK_ID
  );

  const stakedAsset = tokenPriceToAssetToken(
    contractAddress,
    latestSDBalance,
    NETWORK_ID,
    tokenPrice
  );

  return {
    networkId: NETWORK_ID,
    label: 'Staked',
    platformId,
    type: PortfolioElementType.multiple,
    value: stakedAsset.value,
    data: {
      assets: [stakedAsset],
    },
  };
};

const fetchStakedCollateralPool = async (
  owner: Address,
  cache: Cache,
  logCtx: LoggingContext
): Promise<PortfolioElement | undefined> => {
  const contractAddress = CONTRACT_ADDRESS_STADER_COLLATERAL_POOL_ETHEREUM_MAINNET;
  const contractDecimals = DECIMALS_ON_CONTRACT_STADER_TOKEN;

  const client = getEvmClient(NETWORK_ID);
  verboseLog({ ...logCtx, contractAddress }, 'Fetching stader collateral pool');
 
  const rawCollateralBalance = await client.readContract({
    abi: sdCollateralPoolAbi,
    address: contractAddress,
    functionName: 'operatorSDBalance',
    args: [owner],
  });
  verboseLog(
    { ...logCtx, rawCollateralBalance },
    'Call to operatorSDBalance completed'
  );
  if (!rawCollateralBalance) {
    verboseLog(logCtx, 'No collateral balance found; bailing out');
    return;
  } 
  const collateralBalance = new BigNumber(rawCollateralBalance.toString())
    .div(10 ** contractDecimals)
    .toNumber();

  const tokenPrice = await cache.getTokenPrice(
    CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET,
    NETWORK_ID
  );
  verboseLog(
    { ...logCtx, contractAddress, tokenPrice },
    'Token price retrieved from cache'
  );

  const stakedAsset = tokenPriceToAssetToken(
    contractAddress,
    collateralBalance,
    NETWORK_ID,
    tokenPrice
  );

  return {
    networkId: NETWORK_ID,
    label: 'Staked',
    platformId,
    type: PortfolioElementType.multiple,
    value: stakedAsset.value,
    data: {
      assets: [stakedAsset],
    },
  };
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

  const fetchFunctions = [
    fetchStakedEthx,
    fetchStakedPermissionsLessNodeRegistry,
    fetchStakedUtilityPool,
    fetchStakedCollateralPool,
  ];

  const commonParams = [ownerAddress, cache, logCtx] as const;
  
  const results = await Promise.all(
    fetchFunctions.map(fetchFn => fetchFn(...commonParams))
  );

  return results.filter((element): element is PortfolioElement => element !== undefined);
};

const fetcher: Fetcher = {
  id: `${platformId}-${NETWORK_ID}-staking`,
  networkId: NETWORK_ID,
  executor,
};

export default fetcher;
