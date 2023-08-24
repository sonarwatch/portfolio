export type Pool = {
  id: { id: string };
  name: string;
  value: string;
};

export type PoolInfo = {
  coin_decimals: number[];
  creator: string;
  decimal_scalars: string[];
  fees_deposit: string[];
  fees_swap_in: string[];
  fees_swap_out: string[];
  fees_withdraw: string[];
  flatness: string;
  id: {
    id: string;
  };
  illiquid_lp_supply: string;
  lp_decimal_scalar: string;
  lp_decimals: number;
  lp_supply: {
    type: string;
    fields: { value: string };
  };
  name: string;
  normalized_balances: string[];
  type_names: string[];
  weights: string[];
};
