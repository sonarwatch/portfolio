import { Currency } from '../../types';

export default function getCryptoRate(
  rates: Map<string, number>,
  currency: Currency
) {
  const value = rates.get(currency.coinGeckoId);
  if (!value) {
    return null;
  }
  return 1 / value;
}
