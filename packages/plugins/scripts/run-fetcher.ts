import util from 'node:util';
import { isAddress, networks } from '@sonarwatch/portfolio-core';
import { fetchers, getCache, solanaSimpleFetcher } from '../src';
import durationForHumans from '../src/utils/misc/durationForHumans';
import { runFetcher } from '../src/Fetcher';
import sleep from '../src/utils/misc/sleep';

const argFetcherId = process.argv.at(2);
if (!argFetcherId || argFetcherId === '') {
  console.error('Fetcher ID is missing');
  process.exit(1);
}

const argOwner = process.argv.at(3);
if (!argOwner || argOwner === '') {
  console.error('Owner is missing');
  process.exit(1);
}

async function main(owner: string, fetcherId: string) {
  let fOwner = owner;
  const fetcher = [...fetchers, solanaSimpleFetcher].find(
    (f) => f.id === fetcherId
  );
  if (!fetcher) {
    console.error(`Fetcher cannot be found: ${fetcherId}`);
    process.exit(1);
  }

  const network = networks[fetcher.networkId];
  if (!isAddress(fOwner, network.addressSystem)) {
    fOwner = `0x${fOwner}`;
  }
  if (!isAddress(fOwner, network.addressSystem)) {
    console.error(`Owner address is not valid: ${owner}`);
    process.exit(1);
  }

  const cache = getCache();

  console.log('Fetching...');
  const fetcherResult = await runFetcher(fOwner, fetcher, cache);
  console.log(util.inspect(fetcherResult.elements, false, null, true));
  console.log(`Finished in: ${durationForHumans(fetcherResult.duration)}s`);
  await cache.dispose();
  await sleep(100);
  process.exit(0);
}

main(argOwner, argFetcherId);
