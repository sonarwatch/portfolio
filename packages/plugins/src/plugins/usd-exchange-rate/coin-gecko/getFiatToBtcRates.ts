import axios from 'axios';

export type FiatRatesResponse = {
  rates: Record<
    string,
    {
      name: string;
      unit: string;
      value: number;
      type: 'crypto' | 'fiat';
    }
  >;
};

export default async function getFiatToBtcRates(): Promise<FiatRatesResponse> {
  const res = await axios.get(
    'https://api.coingecko.com/api/v3/exchange_rates'
  );
  return res.data;
}
