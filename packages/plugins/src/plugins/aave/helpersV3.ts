import {
  PortfolioElement,
  PortfolioElementBorrowLend,
  PortfolioElementType,
  ProxyInfo,
  EvmNetworkIdType,
} from '@sonarwatch/portfolio-core';
import {
  UiIncentiveDataProvider,
  UiPoolDataProvider,
} from '@aave/contract-helpers-v3';
import { formatUserSummaryAndIncentives } from '@aave/math-utils-v3';
import { Address } from 'viem';
import { Cache } from '../../Cache';
import { LendingConfig, LendingDataV3 } from './types';
import { getElementLendingData } from './helpers';
import { lendingPoolsPrefix } from './constants';
import getEvmEthersClient from '../../utils/clients/getEvmEthersClient';

/*
 * helpers functions here are the same helpers.ts but using the new library version of aave.
 * The previous library version throws an error with v3 contracts.
 */

export function getUiProvidersV3(
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

export async function fetchLendingForAddressV3(
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
    const lendingData = await cache.getItem<LendingDataV3>(
      lendingPoolAddressProvider,
      {
        prefix: lendingPoolsPrefix,
        networkId,
      }
    );
    if (!lendingData) return null;

    const { poolDataProvider, incentiveDataProvider } = getUiProvidersV3(
      networkId,
      config
    );

    const userSummary = await getUserSummaryV3(
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
    (element): element is PortfolioElementBorrowLend => !!element
  );
}

export async function getUserSummaryV3(
  user: string,
  lendingData: LendingDataV3,
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
