import { currencies } from '../constants';
import { JobData } from '../types';
import getCurrencyRate from './getCurrencyRate';

export default async function getRates(): Promise<JobData> {
  const currencyCodes = currencies.map((currency) => currency.coinConvertId);
  const endpoints = currencyCodes.map((code) => getCurrencyRate(code));
  const data = await Promise.all(endpoints);
  return Object.assign({}, ...data);
}
