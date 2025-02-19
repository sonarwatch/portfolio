export interface PriceData {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
}

export interface CurveTokenPriceResponse {
  chain: string;
  address: string;
  data: PriceData[];
}
