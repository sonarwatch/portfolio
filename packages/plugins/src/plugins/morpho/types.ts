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

export type MorphoAssetAPI = {
  address: string;
  decimals: number;
  logoURI: string | null;
  name: string;
  priceUsd: number | null;
  symbol: string;
};

export type MorphoMarketRes = {
  markets: {
    items: {
      uniqueKey: string;
      loanAsset: MorphoAssetAPI;
      collateralAsset: MorphoAssetAPI;
    }[];
  };
};
export type MorphoVaultRes = {
  vaults: {
    items: {
      address: string;
      asset: MorphoAssetAPI;
      symbol: string;
      name: string;
    }[];
  };
};
