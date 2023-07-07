import util from 'node:util';
import { getCache, runFetcher } from '@sonarwatch/portfolio-core';
import { fetchers } from '../src';

const fetcherId = process.argv.at(2);
if (!fetcherId || fetcherId === '') {
  console.error('Fetcher ID is missing');
  process.exit(1);
}

const owner = process.argv.at(3);

async function main() {
  const fetcher = fetchers.find((f) => f.id === fetcherId);
  if (!fetcher) {
    console.error(`Fetcher cannot be found: ${fetcherId}`);
    process.exit(1);
  }
  if (!owner || owner === '') {
    console.error('Owner is missing');
    process.exit(1);
  }

  const cache = getCache();

  console.log('Fetching...');
  const elements = await runFetcher(owner, fetcher, cache);
  console.log('Portfolio elements:');
  console.log(util.inspect(elements, false, null, true));
  process.exit(0);
}

main();
