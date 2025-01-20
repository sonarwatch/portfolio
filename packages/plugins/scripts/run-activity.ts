import util from 'node:util';
import { isAddress, NetworkId, networks } from '@sonarwatch/portfolio-core';
import { getCache } from '../src';
import sleep from '../src/utils/misc/sleep';
import { runActivity } from '../src/Activity';

const argOwner = process.argv.at(2);
if (!argOwner || argOwner === '') {
  console.error('Owner is missing');
  process.exit(1);
}

async function main(owner: string) {
  const network = networks[NetworkId.solana];
  if (!isAddress(owner, network.addressSystem)) {
    console.error(`Owner address is not valid: ${owner}`);
    process.exit(1);
  }

  const cache = getCache();

  console.log(owner);
  console.log('Fetching...');
  const activityResult = await runActivity(owner, cache);
  console.log(util.inspect(activityResult, false, null, true));
  await cache.dispose();
  await sleep(100);
  process.exit(0);
}

main(argOwner);
