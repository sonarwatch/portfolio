/* eslint-disable no-constant-condition */
import { getCache } from '@sonarwatch/portfolio-core';
import { jobs } from '../src';
import sleep from '../src/utils/misc/sleep';

async function main() {
  const cache = getCache();
  while (true) {
    for (let i = 0; i < jobs.length; i += 1) {
      const job = jobs[i];
      await job.executor(cache).catch((e) => {
        console.error(`job executor error: ${job.id}`, e);
      });
      console.info(`job executor success: ${job.id}`);
    }
    await sleep(5000);
  }
}
main();
