import axios, { AxiosResponse } from 'axios';
import { CoinConvertResponse, CurrencyCodeKey } from '../types';

export default async function getCurrencyRate(currencyCode: CurrencyCodeKey) {
  const code = currencyCode.toLowerCase();
  try {
    const value: AxiosResponse<CoinConvertResponse> = await axios.get(
      `https://api.coinconvert.net/convert/usd/${code}?amount=1`
    );
    return {
      [currencyCode]: value.data[currencyCode] ?? null,
    };
  } catch (error) {
    return {
      [currencyCode]: null,
    };
  }
}
