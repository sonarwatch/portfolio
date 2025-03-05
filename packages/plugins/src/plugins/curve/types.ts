export enum RegistryId {
  main = 'main',
  crypto = 'crypto',
  factory = 'factory',
  factorycrypto = 'factory-crypto',
  factorycrvusd = 'factory-crvusd',
  factorytricrypto = 'factory-tricrypto',
  factorytwocrypto = 'factory-twocrypto',
  factoryeywa = 'factory-eywa',
  factorystableng = 'factory-stable-ng',
}

export interface Token {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  usdPrice: number;
}

export interface CurveTokenPriceResponse {
  success: boolean;
  data: {
    tokens: Token[];
  };
  generatedTimeMs: number;
}
