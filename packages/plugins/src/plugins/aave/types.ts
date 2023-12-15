import { ReservesIncentiveDataHumanized } from '@aave/contract-helpers';
import {
  formatReservesAndIncentives,
  UserIncentiveDict,
} from '@aave/math-utils';
import { NetworkIdType } from '@sonarwatch/portfolio-core';

type FormattedReserves = ReturnType<typeof formatReservesAndIncentives>;

export type LendingConfig = {
  chainId: number;
  networkId: NetworkIdType;
  elementName: string;
  lendingPoolAddressProvider: string;
  uiIncentiveDataProviderAddress: string;
  uiPoolDataProviderAddress: string;
  version: number;
};

export type LendingData = {
  lendingPoolAddressProvider: string;
  chainId: number;
  networkId: NetworkIdType;
  currentTimestamp: number;
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
  formattedReserves: FormattedReserves;
  reserveIncentives: ReservesIncentiveDataHumanized[];
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

export type UserSummary = {
  userReservesData: UserReserveData[];
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
