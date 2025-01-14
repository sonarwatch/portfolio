export type BorrowIncentivePoolPointFields = {
  point_type: {
    name: string;
  };
  distributed_point_per_period: string;
  point_distribution_time: string;
  distributed_point: string;
  points: string;
  index: string;
  base_weight: string;
  weighted_amount: string;
  last_update: string;
  created_at: string;
};

export type BorrowIncentivePoolFields = {
  pool_type: {
    name: string;
  };
  points: BorrowIncentivePoolPointFields[]; // one borrow pool can have multiple points (e.g. sui and sca)
  min_stakes: string;
  max_stakes: string;
  stakes: string;
  created_at: string;
};

export interface BorrowIncentivePoolsQueryInterface {
  incentive_pools: BorrowIncentivePoolFields[];
}

export type ParsedBorrowIncentivePoolPointData = {
  pointType: string;
  distributedPointPerPeriod: number;
  period: number;
  distributedPoint: number;
  points: number;
  index: number;
  baseWeight: number;
  weightedAmount: number;
  lastUpdate: number;
  createdAt: number;
};

type CalculatedBorrowIncentivePoolPointData = {
  baseWeight: number;
  weightedStakedAmount: number;
  weightedStakedCoin: number;
  // weightedStakedValue: number;
  distributedPointPerSec: number;
  accumulatedPoints: number;
  currentPointIndex: number;
  currentTotalDistributedPoint: number;
  rewardApr: number;
  rewardPerSec: number;
};

export type BorrowIncentivePoolPoints = {
  symbol: string;
  coinName: string;
  coinType: string;
  decimals: number;
  // coinPrice: number;
} & Required<
  Pick<
    ParsedBorrowIncentivePoolPointData,
    'points' | 'distributedPoint' | 'weightedAmount'
  >
> &
  CalculatedBorrowIncentivePoolPointData;

type BorrowIncentivePool = {
  coinName: string;
  symbol: string;
  coinType: string;
  decimals: number;
  // coinPrice: number;
  stakedAmount: number;
  stakedCoin: number;
  // stakedValue: number;
  points: Record<string, BorrowIncentivePoolPoints>;
};

export type BorrowIncentivePools = Record<string, BorrowIncentivePool>