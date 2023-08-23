export type PoolInfo = {
  assets: [
    {
      amount: string;
      info: TokenInfo;
    },
    {
      amount: string;
      info: TokenInfo;
    }
  ];
  total_share: string;
};

export type TokenInfo = {
  [key: string]: { [key: string]: string };
};
