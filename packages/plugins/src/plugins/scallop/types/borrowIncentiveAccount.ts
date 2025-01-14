export type BorrowIncentiveAccountPointFields = {
  point_type: {
    name: string;
  };
  weighted_amount: string;
  points: string;
  total_points: string;
  index: string;
};

export type BorrowIncentiveAccountFields = {
  points_list: BorrowIncentiveAccountPointFields[];
  pool_type: {
    name: string;
  };
  debt_amount: string;
};

export interface BorrowIncentiveAccountsQueryInterface {
  pool_records: BorrowIncentiveAccountFields[];
}

export type ParsedBorrowIncentiveAccountPoolData = {
  pointType: string;
  weightedAmount: number;
  points: number;
  totalPoints: number;
  index: number;
};

export type ParsedBorrowIncentiveAccountData = {
  pointList: ParsedBorrowIncentiveAccountPoolData[];
  poolType: string;
  debtAmount: number;
};

export type BorrowIncentiveReward = {
  coinName: string;
  coinType: string;
  symbol: string;
  decimals: number;
  coinPrice: number;
  availableClaimCoin: number;
  availableClaimAmount: number;
  boostValue: number;
};

export type BorrowIncentiveAccounts = Record<
  string,
  ParsedBorrowIncentiveAccountData
>;
