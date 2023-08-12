import { ReservesIncentiveDataHumanized } from '@aave/contract-helpers';
import { formatReservesAndIncentives } from '@aave/math-utils';
import { NetworkIdType } from '@sonarwatch/portfolio-core';

type FormattedReserves = ReturnType<typeof formatReservesAndIncentives>;

export type LendingConfig = {
  chainId: number;
  networkId: NetworkIdType;
  elementName: string;
  lendingPoolAddressProvider: string;
  uiIncentiveDataProviderAddress: string;
  uiPoolDataProviderAddress: string;
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
