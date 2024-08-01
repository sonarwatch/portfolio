import util from 'node:util';
import { getAddressSystem } from '@sonarwatch/portfolio-core';
import { airdropFetchers, getCache } from '../src';
import { runAirdropFetchers } from '../src/AirdropFetcher';
import sleep from '../src/utils/misc/sleep';
import durationForHumans from '../src/utils/misc/durationForHumans';

const argOwner = process.argv.at(2);
if (!argOwner || argOwner === '') {
  console.error('Owner is missing');
  process.exit(1);
}

async function main(owner: string) {
  let fOwner = owner;
  let addressSystem = getAddressSystem(fOwner);
  if (!addressSystem) {
    fOwner = `0x${fOwner}`;
    addressSystem = getAddressSystem(fOwner);
  }
  if (!addressSystem) {
    console.error(`Owner address is not valid: ${owner}`);
    process.exit(1);
  }

  const cache = getCache();
  console.log('Fetching...');
  const fetcherResult = await runAirdropFetchers(
    fOwner,
    addressSystem,
    airdropFetchers,
    cache,
    false
  );

  console.log(util.inspect(fetcherResult.airdrops, false, null, true));
  console.log(`Finished in: ${durationForHumans(fetcherResult.duration)}`);
  await cache.dispose();
  await sleep(100);
  process.exit(0);
}

main(argOwner);
