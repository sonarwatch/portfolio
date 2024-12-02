import { ID } from '../../utils/sui/types/id';

export type UserInfo = {
  id: ID;
  name: string;
  value: Value;
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
