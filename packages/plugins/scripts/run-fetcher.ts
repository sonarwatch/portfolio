import util from 'node:util';
import {
  Context,
  getCache,
  getTokenPriceCache,
} from '@sonarwatch/portfolio-core';
import { fetchers } from '../src';

const fetcherId = process.argv.at(2);
if (!fetcherId || fetcherId === '') {
  console.log('Fetcher ID is missing');
  process.exit(1);
}

const owner = process.argv.at(3);

async function runFetcher() {
  const fetcher = fetchers.find((f) => f.id === fetcherId);
  if (!fetcher) {
    console.log(`Fetcher cannot be found: ${fetcherId}`);
    process.exit(1);
  }
  if (!owner || owner === '') {
    console.log('Owner is missing');
    process.exit(1);
  }

  const context: Context = {
    cache: getCache(),
    tokenPriceCache: getTokenPriceCache(),
  };

  console.log('Fetching...');
  const elements = await fetcher.executor(owner, context);
  console.log('Portfolio elements:');
  console.log(util.inspect(elements, false, null, true));
  process.exit(0);
}

runFetcher();
