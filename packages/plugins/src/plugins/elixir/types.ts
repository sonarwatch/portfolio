export interface Vault {
  id: {
    id: string;
  };
  bank: string;
  bank_account: string;
  coin_balance: string;
  operator: string;
  perpetual_id: string;
  total_shares: string;
  type: string;
  user_pending_withdrawals: {
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
    type: string;
  };
  user_shares: {
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
    type: string;
  };
}

export type PositionField = {
  id: string;
  name: string;
  value: string;
};
