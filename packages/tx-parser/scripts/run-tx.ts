import * as util from 'node:util';
import { Connection } from '@solana/web3.js';
import { isAddress } from '@sonarwatch/portfolio-core';
import { runTx } from '../src/utils/run-tx';

const argOwner = process.argv.at(2);
if (!argOwner || argOwner === '') {
  console.error('Owner is missing');
  process.exit(1);
}

const argSignature = process.argv.at(3);
if (!argSignature || argSignature === '') {
  console.error('Signature is missing');
  process.exit(1);
}

async function main(owner: string, signature: string) {
  if (!isAddress(owner, 'solana')) {
    console.error(`Owner address is not valid: ${owner}`);
    process.exit(1);
  }

  if (!signature) {
    console.error(`Signature is not valid: ${signature}`);
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
  const transactionsResult = await runTx(connection, owner, signature);
  console.log(util.inspect(transactionsResult, false, null, true));
  process.exit(0);
}

main(argOwner, argSignature);
