import axios, { AxiosError, isAxiosError } from 'axios';
import { fiatCurrencies, PricedCurrency } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { coingeckoExchangeRatesUrl } from '../../utils/coingecko/constants';
import { CoingeckoExchangeRatesResponse } from '../../utils/coingecko/types';
import { pricedCurrenciesKey, pricedCurrenciesPrefix } from './constants';
import sleep from '../../utils/misc/sleep';

const executor: JobExecutor = async (cache: Cache) => {
  await sleep(180000);
  const res = await axios
    .get<CoingeckoExchangeRatesResponse>(coingeckoExchangeRatesUrl)
    .catch(async (error) => {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.status === 429) await sleep(360000);
      }
      throw error;
    });

  const { rates } = res.data;
  const btcPriceUsd = rates['usd'].value;
  if (!btcPriceUsd || btcPriceUsd <= 0) return;

  const pricedCurrencies: PricedCurrency[] = fiatCurrencies.map(
    (fiat): PricedCurrency => {
      const btcRate = rates[fiat.name.toLowerCase()].value;
      if (!btcRate || btcRate <= 0) {
        return fiat;
      }
      return {
        ...fiat,
        rateToUsd: 1 / (btcPriceUsd / btcRate),
        rateToBtc: btcRate,
        priceUsd: btcPriceUsd / btcRate,
        priceBtc: 1 / btcRate,
      };
    }
  );

  await cache.setItem(pricedCurrenciesKey, pricedCurrencies, {
    prefix: pricedCurrenciesPrefix,
  });
};

const job: Job = {
  id: `coingecko-fiat`,
  executor,
  labels: ['coingecko'],
};
export default job;
