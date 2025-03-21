import { isAddress } from '@sonarwatch/portfolio-core';
import * as util from 'node:util';
import { Connection } from '@solana/web3.js';
import { run } from '../src';

const argOwner = process.argv.at(2);
if (!argOwner || argOwner === '') {
  console.error('Owner is missing');
  process.exit(1);
}

const argAccount = process.argv.at(3);

async function main(owner: string, account?: string) {
  if (!isAddress(owner, 'solana')) {
    console.error(`Owner address is not valid: ${owner}`);
    process.exit(1);
  }

  if (account && !isAddress(account, 'solana')) {
    console.error(`Account address is not valid: ${account}`);
    process.exit(1);
  }

  console.log('Fetching...');
  const connection = new Connection(
    process.env['PORTFOLIO_SOLANA_RPC'] ||
      'https://api.mainnet-beta.solana.com',
    {
      commitment: 'confirmed',
    }
  );
  const transactionsResult = await run(connection, owner, account);
  console.log(util.inspect(transactionsResult, false, null, true));
  process.exit(0);
}

main(argOwner, argAccount);
