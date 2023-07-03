import { Context } from './Context';
import { NetworkIdType } from './Network';
import { PortfolioElement } from './Portfolio';

export type FetcherExecutor = (
  owner: string,
  context: Context
) => Promise<PortfolioElement[]>;
export type Fetcher = {
  id: string;
  networkId: NetworkIdType;
  executor: FetcherExecutor;
};
