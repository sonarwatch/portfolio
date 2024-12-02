import { ID } from '../../utils/sui/types/id';

export type UserInfo = {
  id: ID;
  name: string;
  value: UserInfoValueV1;
};

export type UserInfoValueV1 = {
  fields: UserInfoFieldsV1;
  type: string;
};

export type UserInfoFieldsV1 = {
  last_redeem_reserved_at: string;
  reserved_redeem_amount: string;
  sjwlsui_amount: string;
  voted_sjwlsui_amount: string;
};

export type UserJwltokenInfo = {
  id: ID;
  name: string;
  value: TableValue;
};

export type TableValue = {
  fields: TableFields;
  type: string;
};

export type TableFields = {
  next: null;
  prev: string;
  value: UserInfoValueV2;
};

export type UserInfoValueV2 = {
  fields: UserInfoFieldsV2;
  type: string;
};

export type UserInfoFieldsV2 = {
  jwltoken_staked: string;
  last_epoch_checked: string;
  last_staked_at: string;
  total_rewards: string;
};

export type StakedAssetInfo = {
  asset: string;
  underlying: string;
  parentId: string;
};
