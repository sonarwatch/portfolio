import { LoggingContext } from '../loggingUtils';

/**
 * Utility interface to enrich debugging and logging of contract calls.
 */
export interface AbiCallsContext {
  /**
   * The input used to make the contract call.
   * We're not strongly typing this because it's "support data" -- mainly for logging.
   * For strong typing support, use MulticallIO.
   *
   * `functionName` is required for logging purposes.
   */
  abiCallInput: unknown & { functionName: string };
  /** The logging context */
  logCtx: LoggingContext;
}
