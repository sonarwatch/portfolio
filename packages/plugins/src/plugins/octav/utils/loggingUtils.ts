/** 
 * A logging context is a record of key-value pairs that can be used to add additional context to a log message.
 * The only required key is `fn`, which is the name of the function that is logging the message.
 */
export interface LoggingContext {
    fn: string;
    [key: string]: unknown;
  }
  
/**
 * Logs a message with structured context information only when OCTAV_VERBOSE_LOGGING is enabled.
 * The below solution is not as fancy as supporting logger injection, but I really wanted to get logging working quickly
 * while I was working on protocol integrations.
 *
 * Ref: https://octavfi.slack.com/archives/C08KX01HLMS/p1743515897984209?thread_ts=1743511676.283229&cid=C08KX01HLMS
 */
export const verboseLog = (logCtx: LoggingContext, msg: string): void => {
  if (process.env['OCTAV_VERBOSE_LOGGING'] === 'true') {
    // eslint-disable-next-line no-console
    console.log(msg, logCtx);
  }
};
