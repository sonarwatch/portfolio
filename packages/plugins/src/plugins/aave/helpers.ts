import {
  NetworkIdType,
  PortfolioAsset,
  PortfolioAssetToken,
  PortfolioAssetType,
  PortfolioElement,
  PortfolioElementBorrowLend,
  PortfolioElementBorrowLendData,
  PortfolioElementType,
  ProxyInfo,
  Yield,
  formatTokenAddress,
  getElementLendingValues,
  BorrowLendRate,
  aprToApy,
  TokenPriceSource,
  TokenPrice,
  EvmNetworkIdType,
} from '@sonarwatch/portfolio-core';
import {
  UiIncentiveDataProvider,
  UiPoolDataProvider,
} from '@aave/contract-helpers-v2';
import {
  formatUserSummaryAndIncentives,
  UserIncentiveDict,
} from '@aave/math-utils-v2';
import { Address, ContractFunctionConfig } from 'viem';
import {
  FormattedReserve,
  LendingConfig,
  LendingData,
  ReserveYieldInfo,
  UserReserveData,
  UserReserveDataV3,
  UserSummary,
} from './types';
import { Cache } from '../../Cache';
import { lendingPoolsPrefix } from './constants';
import getEvmEthersClient from '../../utils/clients/getEvmEthersClient';
import { getEvmClient } from '../../utils/clients';
import { zeroBigInt } from '../../utils/misc/constants';
import { stkAbi } from './abi';

export function getUiProviders(
  networkId: EvmNetworkIdType,
  lendingConfig: LendingConfig
) {
  const provider = getEvmEthersClient(networkId);
  const poolDataProvider = new UiPoolDataProvider({
    uiPoolDataProviderAddress: lendingConfig.uiPoolDataProviderAddress,
    provider,
    chainId: lendingConfig.chainId,
  });

  const incentiveDataProvider = new UiIncentiveDataProvider({
    uiIncentiveDataProviderAddress:
      lendingConfig.uiIncentiveDataProviderAddress,
    provider,
    chainId: lendingConfig.chainId,
  });

  return {
    poolDataProvider,
    incentiveDataProvider,
  };
}

export async function fetchLendingForAddress(
  address: Address,
  networkId: EvmNetworkIdType,
  configs: LendingConfig[],
  cache: Cache,
  platformId: string,
  proxyInfo?: ProxyInfo
): Promise<PortfolioElement[]> {
  const elementPromises = configs.map(async (config) => {
    if (!config) return null;
    const { lendingPoolAddressProvider } = config;
    const lendingData = await cache.getItem<LendingData>(
      lendingPoolAddressProvider,
      {
        prefix: lendingPoolsPrefix,
        networkId,
      }
    );
    if (!lendingData) return null;

    const { poolDataProvider, incentiveDataProvider } = getUiProviders(
      networkId,
      config
    );

    const userSummary = await getUserSummary(
      address,
      lendingData,
      poolDataProvider,
      incentiveDataProvider,
      lendingPoolAddressProvider
    );
    const elementData = getElementLendingData(networkId, userSummary);
    if (elementData.value === 0) return null;

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

    return element;
  });

  const elements = await Promise.all(elementPromises);
  return elements.filter(
    (element): element is PortfolioElementBorrowLend => element !== null
  );
}

export async function getUserSummary(
  user: string,
  lendingData: LendingData,
  poolDataProvider: UiPoolDataProvider,
  incentiveDataProvider: UiIncentiveDataProvider,
  lendingPoolAddressProvider: string
) {
  const [userReserves, userIncentives] = await Promise.all([
    poolDataProvider.getUserReservesHumanized({
      lendingPoolAddressProvider,
      user,
    }),
    incentiveDataProvider.getUserReservesIncentivesDataHumanized({
      lendingPoolAddressProvider,
      user,
    }),
  ]);

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
        apr: +reserve.variableBorrowAPR,
        apy: +reserve.variableBorrowAPY,
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
    attributes: {},
    data: {
      address: formatTokenAddress(userReserveData.underlyingAsset, networkId),
      amount: +userReserveData.stableBorrows,
      price: +userReserveData.reserve.priceInUSD,
    },
  };
  const yields = [
    {
      apr: +userReserveData.stableBorrowAPR,
      apy: +userReserveData.stableBorrowAPY,
    },
  ];
  return { stableBorrowedAsset, yields };
}

export function getVarriableBorrowedAsset(
  networkId: NetworkIdType,
  userReserveData: UserReserveData | UserReserveDataV3
) {
  const variableBorrowedAsset: PortfolioAssetToken = {
    networkId,
    type: PortfolioAssetType.token,
    value: +(+userReserveData.variableBorrowsUSD).toFixed(2),
    attributes: {},
    data: {
      address: formatTokenAddress(userReserveData.underlyingAsset, networkId),
      amount: +userReserveData.variableBorrows,
      price: +userReserveData.reserve.priceInUSD,
    },
  };
  const yields = getVariableBorrowYields(userReserveData.reserve);
  return { variableBorrowedAsset, yields };
}

export function getSuppliedAsset(
  networkId: NetworkIdType,
  userReserveData: UserReserveData | UserReserveDataV3
) {
  const suppliedAsset: PortfolioAssetToken = {
    networkId,
    type: PortfolioAssetType.token,
    value: +(+userReserveData.underlyingBalanceUSD).toFixed(2),
    attributes: {},
    data: {
      address: formatTokenAddress(userReserveData.underlyingAsset, networkId),
      amount: +userReserveData.underlyingBalance,
      price: +userReserveData.reserve.priceInUSD,
    },
  };
  const yields = getSupplyYields(userReserveData.reserve);

  const liquidationThreshold = Number(
    userReserveData.reserve.formattedReserveLiquidationThreshold
  );
  return {
    suppliedAsset,
    yields,
    ltv: userReserveData.reserve.isIsolated ? 0 : liquidationThreshold,
  };
}

export function getRewardAssets(
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
        attributes: {},
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
  const suppliedLtvs: number[] = [];
  const suppliedYields: Yield[][] = [];
  const borrowedAssets: PortfolioAsset[] = [];
  const borrowedYields: Yield[][] = [];
  for (let i = 0; i < userReservesData.length; i++) {
    const userReserveData = userReservesData[i];

    // Stable borrows
    if (
      isUserReserveData(userReserveData) &&
      userReserveData.stableBorrows !== '0'
    ) {
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
      const { suppliedAsset, yields, ltv } = getSuppliedAsset(
        networkId,
        userReserveData
      );
      suppliedLtvs.push(ltv);
      suppliedYields.push(yields);
      suppliedAssets.push(suppliedAsset);
    }
  }
  const rewardAssets = getRewardAssets(networkId, calculatedUserIncentives);
  const { borrowedValue, suppliedValue, healthRatio, value, rewardValue } =
    getElementLendingValues({
      suppliedAssets,
      borrowedAssets,
      rewardAssets,
      suppliedLtvs,
    });

  const elementData: PortfolioElementBorrowLendData = {
    rewardAssets,
    rewardValue,
    borrowedAssets,
    borrowedValue,
    borrowedYields,
    healthRatio,
    suppliedAssets,
    suppliedValue,
    suppliedYields,
    value,
  };
  return elementData;
}

export function getRates(
  tokenAddress: string,
  platformId: string,
  formattedReserve: Pick<
    FormattedReserve,
    'supplyAPR' | 'variableBorrowAPR' | 'totalLiquidity' | 'totalDebt'
  >,
  elementName: string
): BorrowLendRate {
  const lendingApr = Number(formattedReserve.supplyAPR);
  const borrowingApr = Number(formattedReserve.variableBorrowAPR);
  const depositedAmount = Number(formattedReserve.totalLiquidity);
  const borrowedAmount = Number(formattedReserve.totalDebt);
  return {
    tokenAddress,
    borrowYield: {
      apy: aprToApy(borrowingApr),
      apr: borrowingApr,
    },
    borrowedAmount,
    depositYield: {
      apy: aprToApy(lendingApr),
      apr: lendingApr,
    },
    depositedAmount,
    platformId,
    poolName: elementName,
  };
}

export function getTokenPriceSourceFromReserve(
  aTokenAddress: string,
  networkId: NetworkIdType,
  platformId: string,
  formattedReserve: Pick<FormattedReserve, 'decimals' | 'underlyingAsset'>,
  underlyingAssetPrice: TokenPrice,
  elementName: string
) {
  const source: TokenPriceSource = {
    id: platformId,
    weight: 1,
    address: aTokenAddress,
    networkId,
    platformId,
    decimals: formattedReserve.decimals,
    price: underlyingAssetPrice.price,
    underlyings: [
      {
        address: formattedReserve.underlyingAsset,
        amountPerLp: 1,
        decimals: formattedReserve.decimals,
        networkId,
        price: underlyingAssetPrice.price,
      },
    ],
    elementName,
    timestamp: Date.now(),
  };
  return source;
}

// typeguard
export function isUserReserveData(
  item: UserReserveData | UserReserveDataV3
): item is UserReserveData {
  return 'stableBorrows' in item && 'stableBorrowAPR' in item;
}

export async function getBalancesAndTotalRewards(
  owner: Address,
  addresses: Address[],
  networkId: EvmNetworkIdType
): Promise<(bigint | undefined)[]> {
  const client = getEvmClient(networkId);
  const balances = await client.multicall({
    contracts: addresses.flatMap<ContractFunctionConfig<typeof stkAbi>>((a) => [
      {
        abi: stkAbi,
        address: a,
        functionName: 'balanceOf',
        args: [owner],
      },
      {
        abi: stkAbi,
        address: a,
        functionName: 'getTotalRewardsBalance',
        args: [owner],
      },
    ]),
  });

  return balances.map((b) =>
    !b.result || b.result === zeroBigInt ? undefined : b.result
  );
}
