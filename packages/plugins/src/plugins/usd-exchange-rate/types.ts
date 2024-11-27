export type CurrencyCodeKey = 'BTC' | 'EUR' | 'JPY' | 'SOL' | 'ETH' | 'GBP';

export type Currency = {
  name: CurrencyCodeKey;
  coinGeckoId: string;
  coinConvertId: CurrencyCodeKey;
  type: 'crypto' | 'fiat';
};

export type CoinConvertResponse = {
  status: string;
  USD: number;
} & {
  [key in CurrencyCodeKey]: number;
};

export type JobData = Record<string, number | null>;
