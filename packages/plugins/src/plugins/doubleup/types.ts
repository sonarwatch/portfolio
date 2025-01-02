import { ID } from '../../utils/sui/types/id';

export type Receipt = {
  id: ID;
  amountDeposited: string;
};

export type House = {
  house_pipe_debt: ValueFields;
  house_pool: string;
  id: ID;
  max_supply: string;
  pipe_debt: ValueFields;
  pool: string;
  supply: ValueFields;
  voucher_pool: string;
};

export type ValueFields = {
  fields: Value;
  type: string;
};

export type Value = {
  value: string;
};

export type RedeemRequest = {
  created_at: string;
  id: ID;
  s_coin: SCoin;
  sender: string;
};

export type SCoin = {
  fields: BalanceFields;
  type: string;
};

export type BalanceFields = {
  balance: string;
  id: ID;
};

export type RedeemTicket = {
  owner: string;
  amount: string;
  mint: string;
  lockUntil: number;
};
