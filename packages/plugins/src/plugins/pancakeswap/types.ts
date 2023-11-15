export type PancakeSwapTokenPairMetadataData = {
  balance_x: { value: string };
  balance_y: { value: string };
};

export type StakerInfo = {
  contract: string;
  token: string;
  decimals: number;
  rewardToken?: string;
};
