import { Cache, CacheConfig } from '@sonarwatch/portfolio-core';
import { listen } from 'listhen';
import { createStorageServer } from 'unstorage/server';

const cacheConfig: CacheConfig = {
  type: 'memory',
  params: {},
};
const cache = new Cache(cacheConfig);

const storageServer = createStorageServer(cache.storage, {
  authorize() {},
});

async function main() {
  await listen(storageServer.handle, {
    port: 3000,
  });
}
main();
