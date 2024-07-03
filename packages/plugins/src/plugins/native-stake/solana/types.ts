export type ValidatorsApiResponse = ValidatorApiResponse[];

export type ValidatorApiResponse = {
  vote_identity: string;
  name: string;
  image: string;
};

export type Validator = {
  voter: string;
  name?: string;
  imageUri?: string;
};
