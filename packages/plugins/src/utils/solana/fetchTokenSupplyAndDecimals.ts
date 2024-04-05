import { Connection, PublicKey } from '@solana/web3.js';
import {
  solanaNativeAddress,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import sleep from '../misc/sleep';

const solMints = [solanaNativeAddress, solanaNativeWrappedAddress];

export async function fetchTokenSupplyAndDecimals(
  mint: PublicKey,
  client: Connection,
  sleepMultiplier = 1
): Promise<{ supply: number; decimals: number } | undefined> {
  if (solMints.includes(mint.toString())) {
    const supply = await client.getSupply();
    await sleep(200 * sleepMultiplier);
    return {
      supply: supply.value.total / 10e9,
      decimals: 9,
    };
  }
  const tokenSupplyRes = await client.getTokenSupply(mint);
  if (!tokenSupplyRes.value.uiAmount) return undefined;
  await sleep(200 * sleepMultiplier);
  return {
    supply: parseFloat(tokenSupplyRes.value.uiAmount.toString()),
    decimals: tokenSupplyRes.value.decimals,
  };
}
