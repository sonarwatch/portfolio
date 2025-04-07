import {
  formatReservesAndIncentives,
  ReservesIncentiveDataHumanized,
  UserIncentiveDict,
} from '@aave/math-utils-v2';
import {
  ReservesIncentiveDataHumanized as ReservesIncentiveDataHumanizedV3,
  formatReservesAndIncentives as formatReservesAndIncentivesV3,
} from '@aave/math-utils-v3';
import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import { Abi, Address } from 'viem';

type FormattedReserves = ReturnType<typeof formatReservesAndIncentives>;
export type FormattedReserve = FormattedReserves[number];

export type FormattedReservesV3 = ReturnType<
  typeof formatReservesAndIncentivesV3
>;

export type LendingConfig = {
  chainId: number;
  networkId: EvmNetworkIdType;
  elementName: string;
  lendingPoolAddressProvider: string;
  uiIncentiveDataProviderAddress: string;
  uiPoolDataProviderAddress: string;
  version: 2 | 3;
};

export type YieldConfig = {
  networkId: EvmNetworkIdType;
  elementName: string;
  factory: Address;
  isLegacy: boolean;
};

export interface StakingConfig {
  name: string;
  platformId: string;
  stakedAssetAddress: Address;
  rewardAssetAddress: Address;
  stakingTokenAddress: Address;
}

export type YieldData = {
  conversionRate: string;
  underlyingAssetAddress: Address;
  elementName: string;
};

export type LendingData = {
  lendingPoolAddressProvider: string;
  chainId: number;
  networkId: EvmNetworkIdType;
  currentTimestamp: number;
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
  formattedReserves: FormattedReserves;
  reserveIncentives: ReservesIncentiveDataHumanized[];
};

export type LendingDataV3 = {
  lendingPoolAddressProvider: string;
  chainId: number;
  networkId: EvmNetworkIdType;
  currentTimestamp: number;
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
  formattedReserves: FormattedReservesV3;
  reserveIncentives: ReservesIncentiveDataHumanizedV3[];
};

export type UserReserveData = {
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

export type UserReserveDataV3 = {
  underlyingAsset: string;
  underlyingBalance: string;
  underlyingBalanceUSD: string;
  variableBorrows: string;
  variableBorrowsUSD: string;
  reserve: ReserveYieldInfo;
};

export type UserSummary = {
  userReservesData: UserReserveData[] | UserReserveDataV3[];
  calculatedUserIncentives: UserIncentiveDict;
};

export type ReserveYieldInfo = {
  supplyAPY: string;
  supplyAPR: string;
  variableBorrowAPR: string;
  variableBorrowAPY: string;
  priceInUSD: string;
  symbol: string;
  formattedBaseLTVasCollateral: string;
  formattedReserveLiquidationThreshold: string;
  isIsolated: boolean;
};
