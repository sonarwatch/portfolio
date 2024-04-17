export enum Status {
  Active,
  Frozen,
  Extraction,
  Liquidation,
  Deprecation,
}

export type AssetInfo = {
  onassetMint: string;
  oracleInfoIndex: number;
  ilHealthScoreCoefficient: number;
  positionHealthScoreCoefficient: number;
  minOvercollateralRatio: number;
  maxLiquidationOvercollateralRatio: number;
};

export type Pool = {
  underlyingAssetTokenAccount: string;
  committedCollateralLiquidity: string;
  collateralIld: string;
  onassetIld: string;
  treasuryTradingFeeBps: number;
  liquidityTradingFeeBps: number;
  assetInfo: AssetInfo;
  status: Status;
};
