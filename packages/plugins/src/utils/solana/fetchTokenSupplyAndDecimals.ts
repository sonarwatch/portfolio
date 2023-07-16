import { Connection, PublicKey } from '@solana/web3.js';
import sleep from '../misc/sleep';

const solMints = [
  '11111111111111111111111111111111',
  'So11111111111111111111111111111111111111112',
];

export async function fetchTokenSupplyAndDecimals(
  mint: PublicKey,
  client: Connection,
  sleepMultiplier = 1
): Promise<{ supply: number; decimals: number } | undefined> {
  let mintPublicKey;
  if (typeof mint === 'string') {
    mintPublicKey = new PublicKey(mint);
  } else {
    mintPublicKey = mint;
  }

  if (solMints.includes(mintPublicKey.toString())) {
    const supply = await client.getSupply();
    await sleep(200 * sleepMultiplier);
    return {
      supply: supply.value.total / 10e9,
      decimals: 9,
    };
  }
  const tokenSupplyRes = await client.getTokenSupply(mintPublicKey);
  if (!tokenSupplyRes.value.uiAmount) return undefined;
  await sleep(200 * sleepMultiplier);
  return {
    supply: parseFloat(tokenSupplyRes.value.uiAmount.toString()),
    decimals: tokenSupplyRes.value.decimals,
  };
}
