import { listen } from 'listhen';
import { createStorageServer } from 'unstorage/server';
import { Cache, CacheConfig } from '../src';

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
