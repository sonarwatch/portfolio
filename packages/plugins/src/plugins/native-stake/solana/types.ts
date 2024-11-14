export type ValidatorsApiResponse = ValidatorApiResponse[];

export type ValidatorApiResponse = {
  vote_identity: string;
  name: string;
  image: string;
  apy_estimate: number;
  jito_apy: number;
  staking_apy: number;
  total_apy: number;
  commission: number;
  jito_commission_bps: number;
};

export type Validator = {
  voter: string;
  name?: string;
  imageUri?: string;
  baseApy: number;
  jitoApy: number;
  stakingApy: number;
  totalApy: number;
  stakeCommission: number;
  mevCommission: number;
};
