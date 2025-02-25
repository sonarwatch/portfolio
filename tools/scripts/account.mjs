import bs58 from 'bs58';
import { Connection, PublicKey } from '@solana/web3.js';

// Executing account script: node path/to/account.mjs {pk}
const [, , pk] = process.argv;

const client = new Connection('https://api.mainnet-beta.solana.com');

const acc = await client.getAccountInfo(new PublicKey(pk));

if (acc) {
  console.log({
    discriminator: bs58.encode(acc.data.slice(0, 8)),
    accountDiscriminator: Array.from(acc.data.slice(0, 8)),
    dataSize: acc.data.length,
  });
} else {
  console.log('account not found');
}
