export type SCoinPoolAddress = {
  sCoinType: string;
  sCoinName: string;
  sCoinSymbol: string;
  sCoinMetadataId: string;
  sCoinTreasury: string;
};

export type PoolAddress = {
  coinName: string;
  symbol: string;
  coinType: string;
  coinMetadataId: string;
  decimals: number;
};

export type SpoolAddress = {
  spool?: string;
  spoolReward?: string;
  spoolName?: string;
};

type ProtocolAddress = {
  lendingPoolAddress: string;
  borrowDynamic: string;
  interestModel: string;
  borrowFeeKey: string;
  collateralPoolAddress?: string;
  riskModel?: string;
  supplyLimitKey?: string;
  borrowLimitKey?: string;
  isolatedAssetKey?: string;
};

export type PoolAddressData = PoolAddress &
  ProtocolAddress &
  Partial<SCoinPoolAddress> &
  Partial<SpoolAddress>;

export type PoolAddressMap = Record<string, PoolAddressData>;
