import { StaticJsonRpcProvider } from '@ethersproject/providers';
import 'reflect-metadata';
import {
  UiIncentiveDataProvider,
  UiPoolDataProvider,
} from '@aave/contract-helpers';
import { formatReservesAndIncentives } from '@aave/math-utils';
import {
  BorrowLendRate,
  aprToApy,
  borrowLendRatesPrefix,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lendingConfigs, platformId } from './constants';
import { LendingData } from './types';
import { getRpcEndpoint } from '../../utils/clients/constants';
import { lendingPoolsPrefix } from './helpers';

const executor: JobExecutor = async (cache: Cache) => {
  const lendingConfigsArray = Array.from(lendingConfigs.values()).flat();

  for (let i = 0; i < lendingConfigsArray.length; i++) {
    const lendingConfig = lendingConfigsArray[i];
    if (!lendingConfig) continue;

    const {
      uiPoolDataProviderAddress,
      uiIncentiveDataProviderAddress,
      lendingPoolAddressProvider,
      chainId,
      networkId,
    } = lendingConfig;

    const rpcEndpoint = getRpcEndpoint(networkId);
    const user = rpcEndpoint.basicAuth?.username;
    const password = rpcEndpoint.basicAuth?.password;
    const provider = new StaticJsonRpcProvider(
      {
        url: rpcEndpoint.url,
        user,
        password,
      },
      chainId
    );
    if (!provider) continue;

    const poolDataProvider = new UiPoolDataProvider({
      uiPoolDataProviderAddress,
      provider,
      chainId,
    });

    const incentiveDataProvider = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress,
      provider,
      chainId,
    });

    if (!poolDataProvider || !incentiveDataProvider) continue;

    // If it fails, this is probably because of a contract upgrade.
    // Make sure contracts in /constants.ts are up-to-date.
    const reserves = await poolDataProvider.getReservesHumanized({
      lendingPoolAddressProvider,
    });

    const reservesArray = reserves.reservesData;
    const { baseCurrencyData } = reserves;
    const { marketReferenceCurrencyDecimals } = baseCurrencyData;
    const marketReferencePriceInUsd =
      baseCurrencyData.marketReferenceCurrencyPriceInUsd;
    const currentTimestamp = Math.round(Date.now() / 1000);
    const reserveIncentives =
      await incentiveDataProvider.getReservesIncentivesDataHumanized({
        lendingPoolAddressProvider,
      });
    const formattedReserves = formatReservesAndIncentives({
      reserves: reservesArray,
      currentTimestamp,
      marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd,
      reserveIncentives,
    });
    const poolName = lendingConfig.elementName;

    for (const formattedReserve of formattedReserves) {
      if (!formattedReserve.isActive) continue;
      const tokenAddress = formattedReserve.underlyingAsset;
      const lendingApr = new BigNumber(formattedReserve.supplyAPR).toNumber();
      const borrowingApr = new BigNumber(
        formattedReserve.variableBorrowAPR
      ).toNumber();
      const depositedAmount = new BigNumber(
        formattedReserve.totalLiquidity
      ).toNumber();
      const borrowedAmount = new BigNumber(
        formattedReserve.totalDebt
      ).toNumber();

      const rate: BorrowLendRate = {
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
        poolName,
      };

      await cache.setItem(`${poolName}-${tokenAddress}`, rate, {
        prefix: borrowLendRatesPrefix,
        networkId,
      });
    }

    const lendingData: LendingData = {
      lendingPoolAddressProvider,
      chainId,
      networkId,
      currentTimestamp,
      reserveIncentives,
      formattedReserves,
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
    };
    await cache.setItem(lendingPoolAddressProvider, lendingData, {
      prefix: lendingPoolsPrefix,
      networkId,
    });
  }
};

const job: Job = {
  id: `${platformId}-lending-pools`,
  executor,
};
export default job;
