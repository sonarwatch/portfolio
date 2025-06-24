import { NetworkIdType } from './Network';
import { AddressSystemType } from './Address';
import { UsdValue } from './UsdValue';
import { TokenInfo } from './TokenList';
import { YieldSummary } from './Yield';
import { PortfolioElement } from './Portfolio';

/**
 * Represents the result of a fetcher.
 */
export type FetcherResult = {
  owner: string;
  fetcherId: string;
  networdkId: NetworkIdType;
  duration: number;
  elements: PortfolioElement[];
};

/**
 * Represents the report of a fetcher.
 */
export type FetcherReport = {
  id: string;
  status: 'succeeded' | 'failed';
  duration?: number;
  error?: string;
};

/**
 * Represents the result of multiple fetchers.
 */
export type FetchersResult = {
  date: number;
  owner: string;
  addressSystem: AddressSystemType;
  fetcherReports: FetcherReport[];
  value: UsdValue;
  elements: PortfolioElement[];
  duration: number;
  tokenInfo?: Partial<Record<NetworkIdType, Record<string, TokenInfo>>>;
  yieldSummary?: YieldSummary;
};
