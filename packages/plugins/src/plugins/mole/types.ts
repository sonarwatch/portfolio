export type Vault = {
  vaultInfo: string;
  baseDecimals: number;
  baseToken: string;
  baseTokenPerIbToken: number;
};

export type UserInfo = {
  value: {
    fields: {
      amount: number;
    };
    type: string;
  };
};

export type MoleData = {
  vaults: Vault[];
  farms: Farm[];
  others: {
    globalStorage: string;
  };
};

export type Farm = {
  sourceName: string;
  symbol1Address: string;
  symbol1Decimals: number;
  symbol2Address: string;
  symbol2Decimals: number;
  lpAddress: string;
  borrowingInterests: BorrowingInterest[];
};

export type BorrowingInterest = {
  address: string;
  isReverse: boolean;
  upgradeAddr: string;
  workerInfo: string;
  pool: string;
};

export type VaultInfo = {
  value: {
    fields: {
      positions: {
        fields: {
          id: {
            id: string;
          };
        };
      };
    };
  };
};

export type PositionInfo = {
  id: {
    id: string;
  };
  name: string;
  value: {
    fields: {
      debt_share: string;
      owner: string;
      worker: string;
    };
    type: string;
  };
};

export type PositionSummary = {
  id: string;
  owner: string;
  worker: string;
};
