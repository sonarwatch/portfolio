import { listen } from 'listhen';
import { createStorageServer } from 'unstorage/server';
import { jobs } from '@sonarwatch/portfolio-plugins';
import { Cache, getCacheDriver } from '@sonarwatch/portfolio-core';

const isServerPublic = process.env['CACHE_SERVER_PUBLIC'] === 'true';
const bearerToken = process.env['CACHE_SERVER_BEARER_TOKEN'];
const expectedAuthorizationHeader = `Bearer ${bearerToken}`;

if (!isServerPublic && (!bearerToken || bearerToken === '')) {
  console.error('Server is not public and bearer token is missing');
  process.exit(1);
}

const driver = getCacheDriver();
const cache = new Cache(driver);

const storageServer = createStorageServer(cache.storage, {
  authorize(req) {
    // Always authorize when server is public
    if (isServerPublic) return;

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
  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (let i = 0; i < jobs.length; i += 1) {
      const job = jobs[i];
      await job.executor(cache).catch((e) => {
        console.error(`job executor error: ${job.id}`, e);
      });
      console.info(`job executor success: ${job.id}`);
    }
  }
}

main();
