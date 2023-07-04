/* eslint-disable no-constant-condition */
import {
  Context,
  NetworkId,
  getCache,
  getTokenPriceCache,
  sleep,
} from '@sonarwatch/portfolio-core';
import { jobs } from '../src';

async function main() {
  const context: Context = {
    cache: getCache(),
    tokenPriceCache: getTokenPriceCache(),
  };
  await context.tokenPriceCache.refreshAll(NetworkId.solana);
  while (true) {
    for (let i = 0; i < jobs.length; i += 1) {
      const job = jobs[i];
      await job.executor(context).catch((e) => {
        console.error(`job executor error: ${job.id}`, e);
      });
      console.info(`job executor success: ${job.id}`);
    }
    await sleep(5000);
  }
}
main();
