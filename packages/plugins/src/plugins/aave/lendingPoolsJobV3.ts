import 'reflect-metadata';
import {
  borrowLendRatesPrefix,
  formatTokenAddress,
} from '@sonarwatch/portfolio-core';
import { formatReservesAndIncentives } from '@aave/math-utils-v3';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import {
  aave3PlatformId,
  lendingPoolsPrefix,
  v3lendingConfigs,
} from './constants';
import { LendingDataV3 } from './types';
import { getRates, getTokenPriceSourceFromReserve } from './helpers';
import { getUiProvidersV3 } from './helpersV3';

const PLATFORM_ID = aave3PlatformId;

/*
 * Essentially the same as lendingPoolsJob.ts, but uses an updated library for v3.
 * The previous library throws an error with v3 contracts.
 */
const executor: JobExecutor = async (cache: Cache) => {
  const lendingConfigsArray = Array.from(v3lendingConfigs.values()).flat();

  const currentTimestamp = Math.round(Date.now() / 1000);
  for (let i = 0; i < lendingConfigsArray.length; i++) {
    const lendingConfig = lendingConfigsArray[i];
    if (!lendingConfig) continue;

    const { lendingPoolAddressProvider, chainId, networkId, elementName } =
      lendingConfig;

    const { poolDataProvider, incentiveDataProvider } = getUiProvidersV3(
      networkId,
      lendingConfig
    );

    if (!poolDataProvider || !incentiveDataProvider) continue;

    // If it fails, this is probably because of a contract upgrade.
    // Make sure contracts in ./constants.ts are up-to-date.
    const reserves = await poolDataProvider.getReservesHumanized({
      lendingPoolAddressProvider,
    });

    const reservesArray = reserves.reservesData;
    const { baseCurrencyData } = reserves;
    const { marketReferenceCurrencyDecimals } = baseCurrencyData;
    const marketReferencePriceInUsd =
      baseCurrencyData.marketReferenceCurrencyPriceInUsd;
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

    // Borrow Lend Rates
    for (const formattedReserve of formattedReserves) {
      if (!formattedReserve.isActive) continue;
      const tokenAddress = formatTokenAddress(
        formattedReserve.underlyingAsset,
        networkId
      );
      const rate = getRates(
        tokenAddress,
        PLATFORM_ID,
        formattedReserve,
        elementName
      );

      await cache.setItem(`${elementName.trim()}-${tokenAddress}`, rate, {
        prefix: borrowLendRatesPrefix,
        networkId,
      });
    }

    const lendingData: LendingDataV3 = {
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

    const underlyingAssetPrices = await cache.getTokenPrices(
      lendingData.formattedReserves.map((r) => r.underlyingAsset),
      networkId
    );
    for (let j = 0; j < lendingData.formattedReserves.length; j++) {
      const formattedReserve = lendingData.formattedReserves[j];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aTokenAddress = (formattedReserve as any).aTokenAddress as string;
      if (!aTokenAddress) continue;

      const underlyingAssetPrice = underlyingAssetPrices[j];
      if (!underlyingAssetPrice) continue;

      const source = getTokenPriceSourceFromReserve(
        aTokenAddress,
        networkId,
        PLATFORM_ID,
        formattedReserve,
        underlyingAssetPrice,
        elementName
      );
      await cache.setTokenPriceSource(source);
    }
  }
};

const job: Job = {
  id: `${PLATFORM_ID}-lending-pools`,
  executor,
  labels: ['normal'],
};
export default job;
