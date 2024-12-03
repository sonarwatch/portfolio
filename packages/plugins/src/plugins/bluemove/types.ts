import { ID } from '../../utils/sui/types/id';

export type Pool = {
  creator: string;
  fee_amount: string;
  fee_x: string;
  fee_y: string;
  id: ID;
  is_freeze: boolean;
  k_last: string;
  lsp_supply: {
    fields: {
      value: string;
    };
    type: string;
  };
  minimum_liq: string;
  reserve_x: string;
  reserve_y: string;
  token_x: string;
  token_y: string;
};

export type LockLpUserInfo = {
  items: {
    fields: {
      contents: {
        fields: {
          key: string;
          value: {
            fields: {
              duration: string;
              locked_amout: string;
              locked_until: string;
              pool_id: string;
              start_time: string;
            };
            type: string;
          };
        };
        type: string;
      }[];
      type: string;
    };
    type: string;
  };
};
