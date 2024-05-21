export type Vault = {
  baseDecimals: number;
  baseToken: string;
  baseTokenPerIbToken: number;
};

export type UserInfo = {
  value: {
    fields: {
      amount: number;
    }
    type: string;
  }
};
