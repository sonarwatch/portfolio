import { LoggingContext } from "../loggingUtils";

export interface AbiCallsContext {
  /** The functionName of the contract call */
  functionName: string;
  /** The logging context */
  logCtx: LoggingContext;
}
