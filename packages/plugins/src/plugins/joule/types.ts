export type UserPositionMap = {
  positions_map: PositionsMap;
  user_position_ids: string[];
};

export type PositionsMap = {
  data: PositionsMapData[];
};

export type PositionsMapData = {
  key: string;
  value: PurpleValue;
};

export type PurpleValue = {
  borrow_positions: BorrowPositions;
  lend_positions: LendPositions;
  position_name: string;
};

export type BorrowPositions = {
  data: BorrowPositionsDatum[];
};

export type BorrowPositionsDatum = {
  key: string;
  value: FluffyValue;
};

export type FluffyValue = {
  borrow_amount: string;
  coin_name: string;
  interest_accumulated: string;
  last_interest_rate_index: LastInterestRateIndex;
};

export type LastInterestRateIndex = {
  v: string;
};

export type LendPositions = {
  data: LendPositionsDatum[];
};

export type LendPositionsDatum = {
  key: string;
  value: string;
};

export type MarketsResponse = {
  res: Market[];
};

export type Market = {
  assetsName: string;
  ltv: string;
  marketSize: string;
  totalBorrowed: string;
  depositApy: number;
  borrowApy: number;
};
