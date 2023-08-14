import { networks } from '@sonarwatch/portfolio-core';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import {
  UiIncentiveDataProvider,
  UiPoolDataProvider,
} from '@aave/contract-helpers';
import { formatReservesAndIncentives } from '@aave/math-utils';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { lendingConfigs, platformId } from './constants';
import { LendingData } from './types';
import { getUrlEndpoint } from '../../utils/clients/constants';

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

    const provider = new StaticJsonRpcProvider(
      {
        url: getUrlEndpoint(lendingConfig.networkId),
      },
      networks[lendingConfig.networkId].chainId
    );
    if (!provider) continue;

    const poolDataProvider = new UiPoolDataProvider({
      uiPoolDataProviderAddress,
      provider,
      chainId: lendingConfig.chainId,
    });

    const incentiveDataProvider = new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress,
      provider,
      chainId: lendingConfig.chainId,
    });

    if (!poolDataProvider || !incentiveDataProvider) continue;
    let reserves;
    try {
      reserves = await poolDataProvider.getReservesHumanized({
        lendingPoolAddressProvider,
      });
    } catch (error) {
      // This is probably because of a contract upgrade.
      // Make sure contracts in /constants.ts are up-to-date.
      console.warn(
        `Unable to parse pool data (getReservesHumanized) - [${networkId}][${lendingPoolAddressProvider}]`
      );
      continue;
    }

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
    await cache.setItem(`${lendingPoolAddressProvider}`, lendingData, {
      prefix: 'aave-lendingPools',
      networkId,
    });
  }
};

const job: Job = {
  id: `${platformId}-lending-pools`,
  executor,
};
export default job;
