import BigNumber from 'bignumber.js';

export type PortfolioAssetParams = {
  address: string;
  amount: number | BigNumber | string;
  alreadyShifted?: boolean;
};
