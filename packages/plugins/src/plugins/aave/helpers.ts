import {
  EvmNetworkIdType,
  NetworkIdType,
  PortfolioAsset,
  PortfolioAssetToken,
  PortfolioAssetType,
  PortfolioElement,
  PortfolioElementBorrowLend,
  PortfolioElementBorrowLendData,
  PortfolioElementType,
  ProxyInfo,
  RpcEndpoint,
  Yield,
  formatTokenAddress,
  getElementLendingValues,
  networks,
} from '@sonarwatch/portfolio-core';
import {
  UiIncentiveDataProvider,
  UiPoolDataProvider,
} from '@aave/contract-helpers';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import {
  UserIncentiveDict,
  formatUserSummaryAndIncentives,
} from '@aave/math-utils';
import Web3 from 'web3-v1';
import DSA, { ChainId } from 'dsa-connect';
import { LendingConfig, LendingData } from './types';
import { Cache } from '../../Cache';
import { getRpcEndpoint } from '../../utils/clients/constants';
import { platformId } from './constants';
import { getBasicAuthHeaders } from '../../utils/misc/getBasicAuthHeaders';

export const lendingPoolsPrefix = 'aave-lendingPools';

export function getDSA(networkId: EvmNetworkIdType, rpcEndpoint: RpcEndpoint) {
  const authHeaders = rpcEndpoint.basicAuth
    ? getBasicAuthHeaders(
        rpcEndpoint.basicAuth.username,
        rpcEndpoint.basicAuth.password
      )
    : undefined;
  const httpHeaders = authHeaders
    ? [
        {
          name: 'Authorization',
          value: authHeaders.Authorization,
        },
      ]
    : undefined;

  const network = networks[networkId];

  return new DSA(
    {
      web3: new Web3(
        new Web3.providers.HttpProvider(rpcEndpoint.url, {
          headers: httpHeaders,
        })
      ),
    },
    network.chainId as ChainId
  );
}

export async function fetchLendingForAddress(
  address: string,
  networkId: NetworkIdType,
  configs: LendingConfig[],
  cache: Cache,
  proxyInfo?: ProxyInfo
): Promise<PortfolioElement[]> {
  const elements: PortfolioElementBorrowLend[] = [];
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    if (!config) continue;
    const {
      lendingPoolAddressProvider,
      uiPoolDataProviderAddress,
      uiIncentiveDataProviderAddress,
    } = config;
    const lendingData = await cache.getItem<LendingData>(
      lendingPoolAddressProvider,
      {
        prefix: lendingPoolsPrefix,
        networkId,
      }
    );
    if (!lendingData) continue;

    const rpcEndpoint = getRpcEndpoint(networkId);
    const user = rpcEndpoint.basicAuth?.username;
    const password = rpcEndpoint.basicAuth?.password;
    const provider = new StaticJsonRpcProvider(
      {
        url: rpcEndpoint.url,
        user,
        password,
      },
      networks[networkId].chainId
    );
    const poolDataProvider = new UiPoolDataProvider({
      uiPoolDataProviderAddress,
      provider,
      chainId: networks[networkId].chainId,
    });

    const incentiveDataProvider = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress,
      provider,
      chainId: networks[networkId].chainId,
    });

    const userSummary = await getUserSummary(
      address,
      lendingData,
      poolDataProvider,
      incentiveDataProvider,
      lendingPoolAddressProvider
    );
    const elementData = getElementLendingData(networkId, userSummary);
    if (elementData.value === 0) continue;

    const element: PortfolioElementBorrowLend = {
      type: PortfolioElementType.borrowlend,
      networkId,
      platformId,
      label: 'Lending',
      value: elementData.value,
      data: elementData,
      name: config.elementName,
      proxyInfo,
    };
    elements.push(element);
  }
  return elements;
}

export async function getUserSummary(
  user: string,
  lendingData: LendingData,
  poolDataProvider: UiPoolDataProvider,
  incentiveDataProvider: UiIncentiveDataProvider,
  lendingPoolAddressProvider: string
) {
  const userReserves = await poolDataProvider.getUserReservesHumanized({
    lendingPoolAddressProvider,
    user,
  });
  const userIncentives =
    await incentiveDataProvider.getUserReservesIncentivesDataHumanized({
      lendingPoolAddressProvider,
      user,
    });
  const userReservesArray = userReserves.userReserves;
  const userSummary = formatUserSummaryAndIncentives({
    currentTimestamp: lendingData.currentTimestamp,
    marketReferencePriceInUsd: lendingData.marketReferencePriceInUsd,
    marketReferenceCurrencyDecimals:
      lendingData.marketReferenceCurrencyDecimals,
    userReserves: userReservesArray,
    formattedReserves: lendingData.formattedReserves,
    userEmodeCategoryId: userReserves.userEmodeCategoryId,
    reserveIncentives: lendingData.reserveIncentives,
    userIncentives,
  });
  return userSummary;
}

type UserReserveData = {
  underlyingAsset: string;
  underlyingBalance: string;
  underlyingBalanceUSD: string;
  stableBorrows: string;
  stableBorrowsUSD: string;
  variableBorrows: string;
  variableBorrowsUSD: string;
  reserve: ReserveYieldInfo;
  stableBorrowAPR: string;
  stableBorrowAPY: string;
};

type UserSummary = {
  userReservesData: UserReserveData[];
  calculatedUserIncentives: UserIncentiveDict;
};

type ReserveYieldInfo = {
  supplyAPY: string;
  supplyAPR: string;
  variableBorrowAPR: string;
  variableBorrowAPY: string;
  priceInUSD: string;
  symbol: string;
};

export function getSupplyYields(reserve: ReserveYieldInfo) {
  let yields: Yield[] = [];
  if (reserve.supplyAPR !== '0') {
    yields = [
      {
        apr: +reserve.supplyAPR,
        apy: +reserve.supplyAPY,
      },
    ];
  }
  return yields;
}

export function getVariableBorrowYields(reserve: ReserveYieldInfo) {
  let yields: Yield[] = [];
  if (reserve.supplyAPR !== '0') {
    yields = [
      {
        apr: -+reserve.variableBorrowAPR,
        apy: -+reserve.variableBorrowAPY,
      },
    ];
  }
  return yields;
}

export function getStableBorrowedAsset(
  networkId: NetworkIdType,
  userReserveData: UserReserveData
) {
  const stableBorrowedAsset: PortfolioAssetToken = {
    networkId,
    type: PortfolioAssetType.token,
    value: +(+userReserveData.stableBorrowsUSD).toFixed(2),
    data: {
      address: userReserveData.underlyingAsset,
      amount: +userReserveData.stableBorrows,
      price: +userReserveData.reserve.priceInUSD,
    },
  };
  const yields = [
    {
      apr: -+userReserveData.stableBorrowAPR,
      apy: -+userReserveData.stableBorrowAPY,
    },
  ];
  return { stableBorrowedAsset, yields };
}

export function getVarriableBorrowedAsset(
  networkId: NetworkIdType,
  userReserveData: UserReserveData
) {
  const variableBorrowedAsset: PortfolioAssetToken = {
    networkId,
    type: PortfolioAssetType.token,
    value: +(+userReserveData.variableBorrowsUSD).toFixed(2),
    data: {
      address: userReserveData.underlyingAsset,
      amount: +userReserveData.variableBorrows,
      price: +userReserveData.reserve.priceInUSD,
    },
  };
  const yields = getVariableBorrowYields(userReserveData.reserve);
  return { variableBorrowedAsset, yields };
}

export function getSuppliedAsset(
  networkId: NetworkIdType,
  userReserveData: UserReserveData
) {
  const suppliedAsset: PortfolioAssetToken = {
    networkId,
    type: PortfolioAssetType.token,
    value: +(+userReserveData.underlyingBalanceUSD).toFixed(2),
    data: {
      address: formatTokenAddress(userReserveData.underlyingAsset, networkId),
      amount: +userReserveData.underlyingBalance,
      price: +userReserveData.reserve.priceInUSD,
    },
  };
  const yields = getSupplyYields(userReserveData.reserve);
  return { suppliedAsset, yields };
}

function getRewardAssets(
  networkId: NetworkIdType,
  calculatedUserIncentives: UserIncentiveDict
): PortfolioAsset[] {
  const rewardAssets: PortfolioAsset[] = [];
  for (const rewardAddress in calculatedUserIncentives) {
    if (
      Object.prototype.hasOwnProperty.call(
        calculatedUserIncentives,
        rewardAddress
      )
    ) {
      const userIncentiveData = calculatedUserIncentives[rewardAddress];
      if (userIncentiveData.claimableRewards.isZero()) continue;
      const amount = userIncentiveData.claimableRewards
        .div(10 ** userIncentiveData.rewardTokenDecimals)
        .toNumber();
      const price = +userIncentiveData.rewardPriceFeed || null;
      const value = price ? amount * price : null;
      const rewardAsset: PortfolioAssetToken = {
        type: PortfolioAssetType.token,
        networkId,
        value,
        data: {
          address: formatTokenAddress(rewardAddress, networkId),
          amount,
          price,
        },
      };
      rewardAssets.push(rewardAsset);
    }
  }
  return rewardAssets;
}

export function getElementLendingData(
  networkId: NetworkIdType,
  userSummary: UserSummary
) {
  const { calculatedUserIncentives, userReservesData } = userSummary;
  const suppliedAssets: PortfolioAsset[] = [];
  const suppliedYields: Yield[][] = [];
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  for (let i = 0; i < userReservesData.length; i++) {
    const userReserveData = userReservesData[i];

    // Stable borrows
    if (userReserveData.stableBorrows !== '0') {
      const { stableBorrowedAsset, yields } = getStableBorrowedAsset(
        networkId,
        userReserveData
      );
      borrowedYields.push(yields);
      borrowedAssets.push(stableBorrowedAsset);
    }

    // Variable borrows
    if (userReserveData.variableBorrows !== '0') {
      const { variableBorrowedAsset, yields } = getVarriableBorrowedAsset(
        networkId,
        userReserveData
      );
      borrowedYields.push(yields);
      borrowedAssets.push(variableBorrowedAsset);
    }

    // Deposits
    if (userReserveData.underlyingBalance !== '0') {
      const { suppliedAsset, yields } = getSuppliedAsset(
        networkId,
        userReserveData
      );
      suppliedYields.push(yields);
      suppliedAssets.push(suppliedAsset);
    }
  }
  const rewardAssets = getRewardAssets(networkId, calculatedUserIncentives);
  const { borrowedValue, suppliedValue, collateralRatio, value } =
    getElementLendingValues(suppliedAssets, borrowedAssets, rewardAssets);

  const elementData: PortfolioElementBorrowLendData = {
    rewardAssets,
    borrowedAssets,
    borrowedValue,
    borrowedYields,
    collateralRatio,
    suppliedAssets,
    suppliedValue,
    suppliedYields,
    value,
  };
  return elementData;
}
