import { Currency } from '../../types';
import { FiatRatesResponse } from '../getFiatToBtcRates';
import getUsdToFiatRate from './getUsdToFiatRate';

export default function getFiatRate(
  fiatRates: FiatRatesResponse,
  currency: Currency
) {
  const btcToUsd = getBtcToUsdRate(fiatRates);
  const btcToFiat = getBtcToFiatRate(fiatRates, currency);
  if (!btcToUsd || !btcToFiat) {
    return null;
  }
  return getUsdToFiatRate(btcToUsd, btcToFiat);
}

function getBtcToUsdRate(rates: FiatRatesResponse) {
  return rates.rates['usd'].value;
}

function getBtcToFiatRate(rates: FiatRatesResponse, currency: Currency) {
  const value = rates.rates[currency.name.toLowerCase()]?.value;
  if (!value) {
    return null;
  }
  return value;
}
