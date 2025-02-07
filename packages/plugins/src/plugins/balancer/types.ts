export type OwnerPoolApiResponse = {
  address: string;
  name: string;
  symbol: string;
  type: string;
  dynamicData: {
    totalShares: string;
    totalLiquidity: string;
  };
  poolTokens: {
    address: string;
    symbol: string;
    name: string;
    balance: string;
    logoURI: string;
    decimals: number;
    balanceUSD: string;
  }[];
  staking: {
    address: string;
    gauge: {
      gaugeAddress: string;
    };
  };
  userBalance: {
    stakedBalances: {
      stakingType: string;
      stakingId: string;
      balance: string;
      balanceUsd: number;
    }[];
    totalBalance: string;
  };
};
