export type PoolAddress = Record<
  string,
  {
    coinName: string;
    symbol: string;
    coinType: string;
    lendingPoolAddress: string;
    borrowDynamic: string;
    interestModel: string;
    borrowFeeKey: string;
    coinMetadataId: string;
    // optional keys
    collateralPoolAddress?: string; // not all pool has collateral
    riskModel?: string;
    supplyLimitKey?: string;
    borrowLimitKey?: string;
    sCoinType?: string;
    sCoinName?: string;
    sCoinSymbol?: string;
    sCoinMetadataId?: string;
    sCoinTreasury?: string;
    isolatedAssetKey?: string;
    spool?: string;
    spoolReward?: string;
    spoolName?: string;
  }
>;
