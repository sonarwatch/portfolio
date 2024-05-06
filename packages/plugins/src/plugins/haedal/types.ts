export type UserInfo = {
  id: ID;
  name: string;
  value: Value;
};

export type ID = {
  id: string;
};

export type Value = {
  fields: Fields;
  type: string;
};

export type Fields = {
  account: string;
  last_deposit_time: string;
  share: string;
  total_amount: string;
  withdrawed_amount: string;
};
