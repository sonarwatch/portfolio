export type ValidatorsApiResponse = ValidatorApiResponse[];

export type ValidatorApiResponse = {
  vote_identity: string;
  name: string;
  image: string;
  activated_stake: number;
  commission: number;
  apy_estimate: number;
};

export type Validator = {
  voter: string;
  name?: string;
  imageUri?: string;
  activated_stake: number;
  commission: number;
  apy_estimate: number;
};
