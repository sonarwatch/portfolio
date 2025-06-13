export type AirdropResponse = {
  code: number;
  msg: string;
  data: {
    token: string;
    claimFlag: number;
  };
};
