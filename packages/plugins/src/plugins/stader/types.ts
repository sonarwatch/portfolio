import { PortfolioElement } from '@sonarwatch/portfolio-core';
import { Address } from 'viem';
import { Cache } from '../../Cache';
import { LoggingContext } from '../octav/utils/loggingUtils';

export type StaderFetcherParams = {
  owner: Address;
  cache: Cache;
  logCtx: LoggingContext;
};

export type StaderFetchFunction = (
  params: StaderFetcherParams
) => Promise<PortfolioElement | undefined>;
