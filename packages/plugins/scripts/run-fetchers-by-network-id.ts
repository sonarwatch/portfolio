import util from 'node:util';
import { assertNetworkId } from '@sonarwatch/portfolio-core';
import { fetchers, getCache } from '../src';
import { runFetchersByNetworkId } from '../src/Fetcher';
import sleep from '../src/utils/misc/sleep';

const networkId = process.argv.at(2);
if (!networkId || networkId === '') {
  console.error('Network ID is missing');
  process.exit(1);
}
const fNetworkId = assertNetworkId(networkId);

const owner = process.argv.at(3);

async function main() {
  const fFetchers = fetchers.filter((f) => f.networkId === fNetworkId);
  if (!owner || owner === '') {
    console.error('Owner is missing');
    process.exit(1);
  }

  const cache = getCache();

  const startDate = Date.now();
  console.log('Fetching...');

  const result = await runFetchersByNetworkId(
    owner,
    fNetworkId,
    fFetchers,
    cache
  );
  const duration = ((Date.now() - startDate) / 1000).toFixed(2);
  console.log(util.inspect(result, false, null, true));
  console.log(`Finished (${duration}s)`);
  await cache.dispose();
  await sleep(100);
  process.exit(0);
}

main();
