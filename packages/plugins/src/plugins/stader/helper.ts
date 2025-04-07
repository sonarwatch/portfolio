import { ethereumNativeAddress } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Address } from 'viem';
import { getEvmClient } from '../../utils/clients';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import { addStakedToRegistry } from '../../utils/octav/addStakedToRegistry';
import { extractMulticallIOResult } from '../../utils/octav/extractMulticallIOResult';
import { convertBigIntToNumber } from '../../utils/octav/tokenFactor';
import { MulticallIO } from '../../utils/octav/types/multicallIO';
import { wrapReadContractCall } from '../../utils/octav/wrapReadContractCall';
import {
    permissionsLessNodeRegistryAbi,
    sdCollateralPoolAbi,
    sdUtilityPoolAbi,
    staderStakingPoolManagerAbi,
} from './abis';
import {
    CONTRACT_ADDRESS_ETHX_TOKEN_ETHEREUM_MAINNET,
    CONTRACT_ADDRESS_PERMISSIONLESS_NODE_REGISTRY_ETHEREUM_MAINNET,
    CONTRACT_ADDRESS_STADER_COLLATERAL_POOL_ETHEREUM_MAINNET,
    CONTRACT_ADDRESS_STADER_STAKING_POOL_MANAGER_ETHEREUM_MAINNET,
    CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET,
    CONTRACT_ADDRESS_STADER_UTILITY_POOL_ETHEREUM_MAINNET,
    DECIMALS_ON_CONTRACT_STADER_TOKEN,
    DECIMALS_ON_CONTRACT_STAKING_POOL_MANAGER_EXCHANGE_RATE,
    NETWORK_ID,
    TOKEN_NAME_STADER_ETH,
    TOKEN_NAME_STADER_ETHX,
    TOKEN_NAME_STADER_SD,
} from './constants';
import { StaderFetcherParams } from './types';

export const generateReadContractParamsForStakedEthx = (
  ownerAddress: Address
) =>
  ({
    address: CONTRACT_ADDRESS_ETHX_TOKEN_ETHEREUM_MAINNET,
    abi: balanceOfErc20ABI,
    functionName: 'balanceOf',
    args: [ownerAddress],
  } as const);

export const generateReadContractParamsForStakedUtilityPool = (
  ownerAddress: Address
) =>
  ({
    address: CONTRACT_ADDRESS_STADER_UTILITY_POOL_ETHEREUM_MAINNET,
    abi: sdUtilityPoolAbi,
    functionName: 'getDelegatorLatestSDBalance',
    args: [ownerAddress],
  } as const);

export const generateReadContractParamsForStakedCollateralPool = (
  ownerAddress: Address
) =>
  ({
    address: CONTRACT_ADDRESS_STADER_COLLATERAL_POOL_ETHEREUM_MAINNET,
    abi: sdCollateralPoolAbi,
    functionName: 'operatorSDBalance',
    args: [ownerAddress],
  } as const);

export const generateReadContractParamsForGetCollateralETH = () =>
  ({
    abi: permissionsLessNodeRegistryAbi,
    address: CONTRACT_ADDRESS_PERMISSIONLESS_NODE_REGISTRY_ETHEREUM_MAINNET,
    functionName: 'getCollateralETH',
  } as const);

export const generateReadContractParamsForGetOperatorIDByAddress = (
  ownerAddress: Address
) =>
  ({
    abi: permissionsLessNodeRegistryAbi,
    address: CONTRACT_ADDRESS_PERMISSIONLESS_NODE_REGISTRY_ETHEREUM_MAINNET,
    functionName: 'operatorIDByAddress',
    args: [ownerAddress],
  } as const);

export const generateReadContractParamsForGetOperatorTotalKeys = (
  operatorId: bigint
) =>
  ({
    abi: permissionsLessNodeRegistryAbi,
    address: CONTRACT_ADDRESS_PERMISSIONLESS_NODE_REGISTRY_ETHEREUM_MAINNET,
    functionName: 'getOperatorTotalKeys',
    args: [operatorId],
  } as const);

export const generateReadContractParamsForGetExchangeRate = () =>
  ({
    abi: staderStakingPoolManagerAbi,
    address: CONTRACT_ADDRESS_STADER_STAKING_POOL_MANAGER_ETHEREUM_MAINNET,
    functionName: 'getExchangeRate',
  } as const);

export const processFetchStakedEthxResult = async (
  params: StaderFetcherParams,
  stakedEthxMulticallIO: MulticallIO<typeof balanceOfErc20ABI, 'balanceOf'>,
  exchangeRateMulticallIO: MulticallIO<
    typeof staderStakingPoolManagerAbi,
    'getExchangeRate'
  >
): Promise<void> => {
  const logCtx = {
    ...params.logCtx,
    fn: `${params.logCtx.fn}::processFetchStakedEthxResult`,
  };

  const balance = extractMulticallIOResult(stakedEthxMulticallIO, {
    logCtx,
  });

  if (!balance) {
    return;
  }

  const exchangeRate = extractMulticallIOResult(exchangeRateMulticallIO, {
    logCtx,
  });

  if (!exchangeRate) {
    return;
  }

  const balanceInEth = new BigNumber(balance.toString()).multipliedBy(
    convertBigIntToNumber(
      exchangeRate,
      DECIMALS_ON_CONTRACT_STAKING_POOL_MANAGER_EXCHANGE_RATE
    )
  );

  addStakedToRegistry(
    params.elementRegistry,
    TOKEN_NAME_STADER_ETHX,
    // We're using the ETH address because we manually applied the exchange rate
    ethereumNativeAddress,
    balanceInEth,
    logCtx
  );
};

export const processFetchStakedUtilityPoolResult = async (
  params: StaderFetcherParams,
  multicallIO: MulticallIO<
    typeof sdUtilityPoolAbi,
    'getDelegatorLatestSDBalance'
  >
): Promise<void> => {
  const logCtx = {
    ...params.logCtx,
    fn: `${params.logCtx.fn}::processFetchStakedUtilityPoolResult`,
  };

  const latestSDBalance = extractMulticallIOResult(multicallIO, {
    logCtx,
  });

  if (!latestSDBalance) {
    return;
  }

  addStakedToRegistry(
    params.elementRegistry,
    TOKEN_NAME_STADER_SD,
    // We don't use multicallIO.input.address here because it's the address of the utility pool
    // and we need to use the address of the stader token contract.
    CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET,
    convertBigIntToNumber(
      latestSDBalance.toString(),
      DECIMALS_ON_CONTRACT_STADER_TOKEN
    ),
    logCtx
  );
};

export const processFetchStakedCollateralPoolResult = async (
  params: StaderFetcherParams,
  multicallIO: MulticallIO<typeof sdCollateralPoolAbi, 'operatorSDBalance'>
): Promise<void> => {
  const logCtx = {
    ...params.logCtx,
    fn: `${params.logCtx.fn}::processFetchStakedCollateralPoolResult`,
  };

  const collateralBalance = extractMulticallIOResult(multicallIO, {
    logCtx,
  });

  if (!collateralBalance) {
    return;
  }

  addStakedToRegistry(
    params.elementRegistry,
    TOKEN_NAME_STADER_SD,
    CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET,
    Number(collateralBalance),
    logCtx
  );
};

export const fetchStakedPermissionsLessNodeRegistry = async (
  owner: Address,
  params: StaderFetcherParams
): Promise<void> => {
  const logCtx = {
    ...params.logCtx,
    fn: `${params.logCtx.fn}::fetchStakedPermissionsLessNodeRegistry`,
  };
  const client = getEvmClient(NETWORK_ID);

  const operatorIDByAddressInput =
    generateReadContractParamsForGetOperatorIDByAddress(owner);
  const getCollateralETHInput = generateReadContractParamsForGetCollateralETH();
  const [operatorIDByAddressResult, getCollateralETHResult] =
    await client.multicall({
      contracts: [operatorIDByAddressInput, getCollateralETHInput],
    });

  const operatorIDByAddressMulticallIO = {
    input: operatorIDByAddressInput,
    output: operatorIDByAddressResult,
  };
  const operatorId = extractMulticallIOResult(operatorIDByAddressMulticallIO, {
    logCtx,
  });
  if (!operatorId) {
    return;
  }

  const getCollateralETHMulticallIO = {
    input: getCollateralETHInput,
    output: getCollateralETHResult,
  };
  const rawCollateralEth = extractMulticallIOResult(getCollateralETHMulticallIO, {
    logCtx,
  });
  if (!rawCollateralEth) {
    return;
  }

  const collateralEth = convertBigIntToNumber(
    rawCollateralEth.toString(),
    DECIMALS_ON_CONTRACT_STADER_TOKEN
  );

  const getOperatorTotalKeysInput =
    generateReadContractParamsForGetOperatorTotalKeys(operatorId);
  const operatorTotalKeys = await wrapReadContractCall(
    client,
    getOperatorTotalKeysInput,
    {
      abiCallInput: getOperatorTotalKeysInput,
      logCtx,
    }
  );

  if (!operatorTotalKeys) {
    return;
  }

  addStakedToRegistry(
    params.elementRegistry,
    TOKEN_NAME_STADER_ETH,
    // The collateral pool contains ETH, so we need to use the ETH address here
    ethereumNativeAddress,
    Number(operatorTotalKeys) * collateralEth,
    logCtx
  );
};
