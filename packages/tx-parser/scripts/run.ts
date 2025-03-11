import { isAddress, NetworkIdType, networks } from '@sonarwatch/portfolio-core';
import * as util from 'node:util';
import { run } from '../src';

const argNetwork = process.argv.at(2);
if (!argNetwork || argNetwork === '') {
  console.error('Network is missing');
  process.exit(1);
}

const argOwner = process.argv.at(3);
if (!argOwner || argOwner === '') {
  console.error('Owner is missing');
  process.exit(1);
}

const argAccount = process.argv.at(4);

async function main(networkArg: string, owner: string, account?: string) {
  const network = networks[networkArg as NetworkIdType];
  if (!network) {
    console.error(`Network is not valid: ${networkArg}`);
    process.exit(1);
  }

  if (!isAddress(owner, network.addressSystem)) {
    console.error(`Owner address is not valid: ${owner}`);
    process.exit(1);
  }

  if (account && !isAddress(account, network.addressSystem)) {
    console.error(`Account address is not valid: ${account}`);
    process.exit(1);
  }

  console.log('Fetching...');
  const transactionsResult = await run(
    networkArg as NetworkIdType,
    owner,
    account
  );
  console.log(util.inspect(transactionsResult, false, null, true));
  process.exit(0);
}

main(argNetwork, argOwner, argAccount);
