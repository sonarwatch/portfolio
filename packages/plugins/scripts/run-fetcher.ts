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

async function runFetcher() {
  const fetcher = fetchers.find((f) => f.id === fetcherId);
  if (!fetcher) {
    console.log(`Fetcher cannot be found: ${fetcherId}`);
    process.exit(1);
  }

  const context: Context = {
    cache: getCache(),
    tokenPriceCache: getTokenPriceCache(),
  };

  console.log('Fetching...');
  const res = await fetcher.executor(
    'tEsT1vjsJeKHw9GH5HpnQszn2LWmjR6q1AVCDCj51nd',
    context
  );
  console.log('Fetched.');
  console.log(util.inspect(res, false, null, true));
  process.exit(0);
}

runFetcher();
