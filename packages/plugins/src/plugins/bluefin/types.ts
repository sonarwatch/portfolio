export type Vault = {
  name: string;
  users: {
    fields: {
      id: {
        id: string;
      };
    };
  };
};

export type BankAccount = {
  id: {
    id: string;
  };
  name: string;
  value: {
    fields: {
      amount_locked: string;
      pending_withdrawal: string;
    };
    type: string;
  };
};

export type PoolAccount = {
  owner: string;
  amount_locked: string;
  pending_withdrawal: string;
};

export type Pool = {
  name: string;
  users: PoolAccount[];
};
