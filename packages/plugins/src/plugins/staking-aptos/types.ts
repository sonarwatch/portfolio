import { PortfolioElementLabel } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { MoveResource } from '../../utils/aptos';

export type MeeiroStakeData = {
  amount: string;
  reward_amount: string;
  reward_debt: string;
  unlocking_amount: string;
  unlocking_start_time: string;
};

export type StakeInfo = {
  amountBn: BigNumber;
  tokenAddress: string;
};

export type StakeConfig = {
  platformId: string;
  typeLabel: PortfolioElementLabel;
  prefixes: string[];
  parseResource: (rData: MoveResource<unknown>) => StakeInfo;
};
