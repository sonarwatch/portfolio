export type AirdropResponse = {
  result: Result;
};

export type Result = {
  data: Data;
};

export type Data = {
  json: JSON;
};

export type JSON = {
  claimWallet: string;
  token: string;
  claimStatus: string;
  availableTokenAmount: number;
};
