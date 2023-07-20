import util from 'node:util';
import { fetchers, getCache } from '../src';
import durationForHumans from '../src/utils/misc/durationForHumans';
import { runFetcher } from '../src/Fetcher';

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
  const fetcherResult = await runFetcher(owner, fetcher, cache);
  console.log(util.inspect(fetcherResult.elements, false, null, true));
  console.log(`Finished in: ${durationForHumans(fetcherResult.duration)}s`);
  process.exit(0);
}

main();
