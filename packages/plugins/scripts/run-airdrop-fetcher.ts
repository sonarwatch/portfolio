import util from 'node:util';
import { isAddress, networks } from '@sonarwatch/portfolio-core';
import { airdropFetchers, getCache } from '../src';
import durationForHumans from '../src/utils/misc/durationForHumans';
import { runAirdropFetcher } from '../src/AirdropFetcher';
import sleep from '../src/utils/misc/sleep';

const argFetcherId = process.argv.at(2);
if (!argFetcherId || argFetcherId === '') {
  console.error('Airdrop Fetcher ID is missing');
  process.exit(1);
}

const argOwner = process.argv.at(3);
if (!argOwner || argOwner === '') {
  console.error('Owner is missing');
  process.exit(1);
}

async function main(owner: string, fetcherId: string) {
  let fOwner = owner;
  const fetcher = airdropFetchers.find((f) => f.id === fetcherId);
  if (!fetcher) {
    console.error(`Airdrop Fetcher cannot be found: ${fetcherId}`);
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
  const fetcherResult = await runAirdropFetcher(fOwner, fetcher, cache, false);
  console.log(util.inspect(fetcherResult.airdrop, false, null, true));
  console.log(`Finished in: ${durationForHumans(fetcherResult.duration)}s`);
  await cache.dispose();
  await sleep(100);
  process.exit(0);
}

main(argOwner, argFetcherId);
