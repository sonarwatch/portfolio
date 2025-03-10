export type APIResponse = {
  regular: Regular;
  protected: Protected;
  averagePoolRate: number;
  totalLiquidity: number;
  availableLiquidity: number;
  regularLiquidityAmount: number;
  protectedLiquidityAmount: number;
  regularAvailableAmount: number;
};

export type Protected = {
  type: string;
  apy: number;
  openCapacity: number;
};

export type Regular = {
  type: string;
  apy: number;
  maxWithdrawalAmount: number;
};
