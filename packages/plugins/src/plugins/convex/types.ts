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
