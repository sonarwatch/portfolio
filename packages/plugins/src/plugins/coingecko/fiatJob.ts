import axios from 'axios';
import { fiatCurrencies, PricedCurrency } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { coingeckoExchangeRatesUrl } from '../../utils/coingecko/constants';
import { CoingeckoExchangeRatesResponse } from '../../utils/coingecko/types';
import { pricedCurrenciesKey, pricedCurrenciesPrefix } from './constants';

const executor: JobExecutor = async (cache: Cache) => {
  const res = await axios.get<CoingeckoExchangeRatesResponse>(
    coingeckoExchangeRatesUrl
  );

  const { rates } = res.data;
  const btcToUsd = rates['usd'].value;
  if (!btcToUsd || btcToUsd <= 0) return;

  const pricedCurrencies: PricedCurrency[] = fiatCurrencies.map((fiat) => {
    const btcRate = rates[fiat.name.toLowerCase()].value;
    if (!btcRate || btcRate <= 0) {
      return fiat;
    }
    return {
      ...fiat,
      usdRate: 1 / (btcToUsd / btcRate),
      btcRate,
      usdPrice: btcToUsd / btcRate,
      btcPrice: 1 / btcRate,
    };
  });

  await cache.setItem(pricedCurrenciesKey, pricedCurrencies, {
    prefix: pricedCurrenciesPrefix,
  });
};

const job: Job = {
  id: `coingecko-fiat`,
  executor,
  label: 'coingecko',
};
export default job;
