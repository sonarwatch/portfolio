export type UpdatedIndexes = {
  supply: {
    poolIndex: bigint;
    p2pIndex: bigint;
  };
  borrow: {
    poolIndex: bigint;
    p2pIndex: bigint;
  };
};

export type ParsedUpdatedIndexes = {
  supply: {
    poolIndex: string;
    p2pIndex: string;
  };
  borrow: {
    poolIndex: string;
    p2pIndex: string;
  };
};
