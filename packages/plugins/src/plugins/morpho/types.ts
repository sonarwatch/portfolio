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

export type MorphoMarketRes = {
  markets: {
    items: {
      uniqueKey: string;
      loanAsset: {
        address: string;
        decimals: number;
        logoURI: string | null;
        name: string;
        priceUsd: number | null;
        symbol: string;
      };
      collateralAsset: {
        address: string;
        decimals: number;
        logoURI: string | null;
        name: string;
        priceUsd: number | null;
        symbol: string;
      };
    }[];
  };
};
export type MorphoVaultRes = {
  vaults: {
    items: {
      address: string;
      asset: {
        address: string;
        decimals: number;
        logoURI: string | null;
        name: string;
        priceUsd: number | null;
        symbol: string;
      };
      symbol: string;
      name: string;
    }[];
  };
};
