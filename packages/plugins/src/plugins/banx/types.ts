export type SplAssetMarket = {
  marketPubkey: string;
  collateral: { mint: string; decimals: number; name: string; ticker: string };
};

export type Collection = {
  marketPubkey: string;
  collectionName: string;
  collectionImage: string;
  collectionFloor: number;
  tensorSlug: string;
};
