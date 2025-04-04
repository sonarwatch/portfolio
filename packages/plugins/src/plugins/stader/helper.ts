import {
    ethereumNativeAddress,
    PortfolioElement,
} from '@sonarwatch/portfolio-core';
import { Address } from 'viem';
import { getEvmClient } from '../../utils/clients';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import { createStakedPortfolioElement } from '../../utils/octav/createStakedPortfolioElement';
import { extractMulticallResult } from '../../utils/octav/extractMulticallResult';
import { convertBigIntToNumber } from '../../utils/octav/tokenFactor';
import { MulticallIO } from '../../utils/octav/types/multicallIO';
import { wrapReadContractCall } from '../../utils/octav/wrapReadContractCall';
import {
    permissionsLessNodeRegistryAbi,
    sdCollateralPoolAbi,
    sdUtilityPoolAbi,
} from './abis';
import {
    CONTRACT_ADDRESS_ETHX_TOKEN_ETHEREUM_MAINNET,
    CONTRACT_ADDRESS_PERMISSIONLESS_NODE_REGISTRY_ETHEREUM_MAINNET,
    CONTRACT_ADDRESS_STADER_COLLATERAL_POOL_ETHEREUM_MAINNET,
    CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET,
    CONTRACT_ADDRESS_STADER_UTILITY_POOL_ETHEREUM_MAINNET,
    DECIMALS_ON_CONTRACT_STADER_TOKEN,
    NETWORK_ID,
    platformId,
} from './constants';
import { StaderFetcherParams } from './types';

export const generateReadContractParamsForStakedEthx = (ownerAddress: Address) =>
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

export const processFetchStakedEthxResult = async (
  params: StaderFetcherParams,
  multicallIO: MulticallIO<typeof balanceOfErc20ABI, 'balanceOf'>
): Promise<PortfolioElement | undefined> => {
  const logCtx = {
    ...params.logCtx,
    fn: `${params.logCtx.fn}::processFetchStakedEthxResult`,
  };
  const contractAddress = multicallIO.input.address;

  const balance = extractMulticallResult(multicallIO.output, {
    functionName: multicallIO.input.functionName,
    logCtx,
  });

  if (!balance) {
    return undefined;
  }

  return createStakedPortfolioElement(
    platformId,
    NETWORK_ID,
    contractAddress,
    contractAddress,
    convertBigIntToNumber(
      balance.toString(),
      DECIMALS_ON_CONTRACT_STADER_TOKEN
    ),
    params.cache,
    logCtx
  );
};

export const processFetchStakedUtilityPoolResult = async (
  params: StaderFetcherParams,
  multicallIO: MulticallIO<
    typeof sdUtilityPoolAbi,
    'getDelegatorLatestSDBalance'
  >
): Promise<PortfolioElement | undefined> => {
  const logCtx = {
    ...params.logCtx,
    fn: `${params.logCtx.fn}::processFetchStakedUtilityPoolResult`,
  };

  const latestSDBalance = extractMulticallResult(multicallIO.output, {
    functionName: multicallIO.input.functionName,
    logCtx,
  });

  if (!latestSDBalance) {
    return undefined;
  }

  return createStakedPortfolioElement(
    platformId,
    NETWORK_ID,
    multicallIO.input.address,
    CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET,
    convertBigIntToNumber(
      latestSDBalance.toString(),
      DECIMALS_ON_CONTRACT_STADER_TOKEN
    ),
    params.cache,
    logCtx
  );
};

export const processFetchStakedCollateralPoolResult = async (
  params: StaderFetcherParams,
  multicallIO: MulticallIO<typeof sdCollateralPoolAbi, 'operatorSDBalance'>
): Promise<PortfolioElement | undefined> => {
  const logCtx = {
    ...params.logCtx,
    fn: `${params.logCtx.fn}::processFetchStakedCollateralPoolResult`,
  };

  const collateralBalance = extractMulticallResult(multicallIO.output, {
    functionName: multicallIO.input.functionName,
    logCtx,
  });

  if (!collateralBalance) {
    return undefined;
  }

  return createStakedPortfolioElement(
    platformId,
    NETWORK_ID,
    multicallIO.input.address,
    CONTRACT_ADDRESS_STADER_TOKEN_ETHEREUM_MAINNET,
    convertBigIntToNumber(
      collateralBalance.toString(),
      DECIMALS_ON_CONTRACT_STADER_TOKEN
    ),
    params.cache,
    logCtx
  );
};

export const fetchStakedPermissionsLessNodeRegistry = async (
  owner: Address,
  params: StaderFetcherParams
): Promise<PortfolioElement | undefined> => {
  const logCtx = {
    ...params.logCtx,
    fn: `${params.logCtx.fn}::fetchStakedPermissionsLessNodeRegistry`,
  };

  const contractAddress =
    CONTRACT_ADDRESS_PERMISSIONLESS_NODE_REGISTRY_ETHEREUM_MAINNET;

  const client = getEvmClient(NETWORK_ID);

  const [operatorIDByAddressResult, getCollateralETHResult] =
    await client.multicall({
      contracts: [
        generateMulticallInputForGetOperatorIDByAddress(owner),
        generateMulticallInputForGetCollateralETH(),
      ],
    });

  const operatorId = extractMulticallResult<
    typeof permissionsLessNodeRegistryAbi,
    'operatorIDByAddress'
  >(operatorIDByAddressResult, {
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
    rawCollateralEth.toString(),
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
    params.cache,
    logCtx
  );
};
