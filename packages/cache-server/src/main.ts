import { listen } from 'listhen';
import { createStorageServer } from 'unstorage/server';
import {
  jobs as portfolioJobs,
  walletTokensPlatform,
} from '@sonarwatch/portfolio-plugins';
import { Job, getCache } from '@sonarwatch/portfolio-core';
import durationForHumans, { sleep } from './helpers';

const isPublic = process.env['IS_PUBLIC'] === 'true';
const bearerToken = process.env['BEARER_TOKEN'];
const expectedAuthorizationHeader = `Bearer ${bearerToken}`;

if (!isPublic && (!bearerToken || bearerToken === '')) {
  console.error('Server is not public and bearer token is missing');
  process.exit(1);
}

const cache = getCache();

const storageServer = createStorageServer(cache.storage, {
  authorize(req) {
    // Always authorize when server is public
    if (isPublic) return;

    // Always authorize reading
    if (req.type === 'read') return;

    const authorizationHeader = req.event.node.req.headers.authorization;
    if (authorizationHeader !== expectedAuthorizationHeader) {
      throw new Error('Unauthorized');
    }
  },
});

async function main() {
  await listen(storageServer.handle);

  // Split jobs into 2 arrays of jobs
  const [walletTokensJobs, otherJobs] = portfolioJobs.reduce(
    ([pass, fail]: [Job[], Job[]], elem: Job): [Job[], Job[]] =>
      elem.id.startsWith(walletTokensPlatform.id)
        ? [[...pass, elem], fail]
        : [pass, [...fail, elem]],
    [[], []]
  );

  runJobs(walletTokensJobs);
  runJobs(otherJobs);
}

async function runJobs(jobs: Job[]) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (let i = 0; i < jobs.length; i += 1) {
      const job = jobs[i];
      const startDate = Date.now();
      let failed = false;

      await job.executor(cache).catch(() => {
        failed = true;
      });

      const duration = durationForHumans(Date.now() - startDate);
      console.info(`${job.id} [${failed ? 'FAILED' : 'SUCCESS'}][${duration}]`);
      await sleep(5000);
    }
    await sleep(5000);
  }
}

main();
