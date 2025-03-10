const BN = require('bn.js');
const bs58 = require('bs58');
import { Connection, PublicKey } from '@solana/web3.js';

function isValidPublicKey(value: string): boolean {
  try {
    new PublicKey(value);
    return true;
  } catch {
    return false;
  }
}

function searchValue(buffer: Buffer, rawInput: string) {
  let results: { index: number; fieldType: string; rawInput: string }[] = [];

  if (isValidPublicKey(rawInput)) {
    const targetBytes = Buffer.from(new PublicKey(rawInput).toBytes());
    const index = buffer.indexOf(targetBytes);
    if (index !== -1) results.push({ index, fieldType: 'PublicKey', rawInput });
  } else {
    const numValue = BigInt(rawInput);

    const types = [
      { size: 1, method: (val: number) => Buffer.from([val]), name: 'u8' },
      {
        size: 2,
        method: (val: number) => {
          const buf = Buffer.alloc(2);
          buf.writeUInt16LE(val, 0);
          return buf;
        },
        name: 'u16',
      },
      {
        size: 4,
        method: (val: number) => {
          const buf = Buffer.alloc(4);
          buf.writeUInt32LE(val, 0);
          return buf;
        },
        name: 'u32',
      },
      {
        size: 8,
        method: (val: number) => new BN(val).toArrayLike(Buffer, 'le', 8),
        name: 'u64',
      },
    ];

    for (const { size, name } of types) {
      if (numValue <= BigInt(2 ** (size * 8) - 1)) {
        const targetBytes = Number(numValue);
        const index = buffer.indexOf(targetBytes);
        if (index !== -1) results.push({ index, fieldType: name, rawInput });
      }
    }
  }

  return results;
}

async function main() {
  const [, , pk, search] = process.argv;

  if (!pk) {
    console.error(
      'Usage: ts-node tools/scripts/inspectAccount.ts <publicKey> [searchValue]'
    );
    process.exit(1);
  }

  const client = new Connection('https://api.mainnet-beta.solana.com');

  try {
    const acc = await client.getAccountInfo(new PublicKey(pk));

    if (acc && acc.data) {
      console.log({
        discriminator: {
          bytes: bs58.encode(acc.data.slice(0, 8)),
          numbers: Array.from(acc.data.slice(0, 8)),
        },
        dataSize: acc.data.length,
        owner: acc.owner.toString(),
      });

      if (search?.length) {
        const searchResults = searchValue(acc.data, search);

        if (searchResults.length > 0) {
          searchResults.forEach(({ index, fieldType, rawInput }) => {
            console.log(
              `Found ${rawInput} of type ${fieldType} at offset ${index}`
            );
          });
        } else {
          console.log(`Value ${search} not found in the buffer.`);
        }
      }

      [
        'So11111111111111111111111111111111111111112',
        'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4',
        'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo',
        'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
        'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
        'jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v',
      ].forEach((search) => {
        const searchResults = searchValue(acc.data, search);
        if (searchResults.length > 0) {
          searchResults.forEach(({ index, fieldType, rawInput }) => {
            console.log(
              `Found ${rawInput} of type ${fieldType} at offset ${index}`
            );
          });
        }
      });
    } else {
      console.log('Account not found');
    }
  } catch (error) {
    console.error('Error fetching account info:', error);
  }
}

// Run the script
main().catch(console.error);
