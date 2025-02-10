export type CoingeckoCoin = {
  id: string;
  symbol: string;
  name: string;
  platforms: { [key: string]: string };
};
export type CoingeckoCoinsListResponse = CoingeckoCoin[];

export type CoingeckoCoinMarket = {
  id: string;
  symbol: string;
  name: string;
  platforms: { [key: string]: string };
};
export type CoingeckoCoinsMarketsResponse = CoingeckoCoinMarket[];

export type CoingeckoRate = {
  name: string;
  unit: string;
  value: number;
  type: 'crypto' | 'fiat';
};
export type CoingeckoExchangeRatesResponse = {
  rates: Record<string, CoingeckoRate>;
};
