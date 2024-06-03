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

export type VaultAccount = {
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

export type Bank = {
  accounts: {
    fields: {
      id: {
        id: string;
      };
    };
    type: string;
  };
};

export type BankAccount = {
  id: {
    id: string;
  };
  name: string;
  value: {
    fields: {
      balance: string;
      owner: string;
    };
    type: string;
  };
};

export type PerpetualV2 = {
  id: {
    id: string;
  };
  name: string;
  positions: {
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
    type: string;
  };
  priceOracle: string;
};

export type UserPosition = {
  id: {
    id: string;
  };
  name: string;
  value: {
    fields: {
      isPosPositive: boolean;
      margin: string;
      mro: string;
      oiOpen: string;
      perpID: string;
      qPos: string;
      user: string;
    };
    type: string;
  };
};

export type PerpetualMeta = {
  symbol: string;
  perpetualAddress: {
    id: string;
    owner: string;
    dataType: string;
  };
};
