export type LiquidswapLiquidityPoolData = {
  coin_x_reserve: { value: string };
  coin_y_reserve: { value: string };
  x_scale: string;
  y_scale: string;
};

export type LpInfo = {
  lpType: string;
  poolType: string;
  typeX: string;
  typeY: string;
};
