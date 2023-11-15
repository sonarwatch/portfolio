export type TheGraphUniV2Pair = UniV2Pair & {
  reserveUSD: string;
  volumeUSD: string;
  trackedReserveETH: string;
  reserveETH: string;
};

export type UniV2Pair = {
  id: string;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
  token0: {
    id: string;
  };
  token1: {
    id: string;
  };
};
