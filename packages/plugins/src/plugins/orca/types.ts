export type WhirlpoolStat = {
  address: string;
  stats: {
    '24h': {
      volume: string;
      fees: string;
    };
  };
  tvlUsdc: string;
};
