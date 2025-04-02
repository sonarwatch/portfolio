import {
  ethereumNativeAddress,
  formatEvmAddress,
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  CONTRACT_ADDRESS_ETHX_TOKEN_ETHEREUM_MAINNET,
  CONTRACT_ADDRESS_PERMISSIONLESS_NODE_REGISTRY_ETHEREUM_MAINNET,
  platformId,
} from './constants';

import { Address } from 'viem';
import { Cache } from '../../Cache';
import { getEvmClient } from '../../utils/clients';
import { getBalances } from '../../utils/evm/getBalances';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { LoggingContext, verboseLog } from '../octav/utils/loggingUtils';
import { permissionsLessNodeRegistryAbi } from './abi';

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
  verboseLog({ ...logCtx, operatorId }, 'Call to operatorIDByAddress completed');
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
  verboseLog({ ...logCtx, operatorTotalKeys }, 'Call to getOperatorTotalKeys completed');
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
  verboseLog({ ...logCtx, rawCollateralEth }, 'Call to getCollateralETH completed');
  if (!rawCollateralEth) {
    throw new Error('Call to getCollateralETH returned no value');
  }

  const collateralEth = new BigNumber(rawCollateralEth.toString())
  .div(10 ** contractDecimals)
  .toNumber();

  // We must get the price of ETH
  const contractAddressForEth = ethereumNativeAddress;
  const tokenPrice = await cache.getTokenPrice(contractAddressForEth, NETWORK_ID);

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

const executor: FetcherExecutor = async (owner: string, cache: Cache): Promise<PortfolioElement[]> => {
  const ownerAddress: Address = formatEvmAddress(owner) as Address;
  const logCtx = {
    fn: 'staderStakingEthereumFetcher::executor',
    ownerAddress,
    networkId: NETWORK_ID,
  };

  const elements: PortfolioElement[] = [];

  const stakedEthx = await fetchStakedEthx(ownerAddress, cache, logCtx);
  if (stakedEthx) {
    elements.push(stakedEthx);
  }

  const stakedPermissionsLessNodeRegistry =
    await fetchStakedPermissionsLessNodeRegistry(ownerAddress, cache, logCtx);
  if (stakedPermissionsLessNodeRegistry) {
    elements.push(stakedPermissionsLessNodeRegistry);
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-${NETWORK_ID}-staking`,
  networkId: NETWORK_ID,
  executor,
};

export default fetcher;
