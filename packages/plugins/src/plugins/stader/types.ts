import { Cache } from '../../Cache';
import { LoggingContext } from '../../utils/octav/loggingUtils';

export type StaderFetcherParams = {
  cache: Cache;
  logCtx: LoggingContext;
};
