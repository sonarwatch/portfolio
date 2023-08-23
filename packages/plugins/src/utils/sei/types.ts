export type PoolInfo = {
  lp_token_address: string;
  lp_token_supply: string;
  token1_denom: { [k: string]: string };
  token1_reserve: string;
  token2_denom: { [k: string]: string };
  token2_reserve: string;
};

export type TokenInfo = {
  decimals: number;
  name: string;
  symbol: string;
  total_supply: string;
};

export type MinterInfo = {
  cap: string;
  minter: string;
};

export type Balance = {
  balance: string;
};
