import { ID } from '../../utils/sui/structs/id';

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
