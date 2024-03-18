import { PublicKey } from '@solana/web3.js';
import {
  solanaNativeAddress,
  solanaNativeDecimals,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import { SolanaClient } from '../clients/types';
import { mintAccountStruct } from './structs';
import { getParsedMultipleAccountsInfo } from './getParsedMultipleAccountsInfo';

const solMints = [solanaNativeAddress, solanaNativeWrappedAddress];

export async function getMultipleDecimals(
  connection: SolanaClient,
  mints: PublicKey[]
): Promise<(number | null)[]> {
  const mintAccounts = await getParsedMultipleAccountsInfo(
    connection,
    mintAccountStruct,
    mints.filter((m) => solMints.includes(m.toString()))
  );
  const decimalsMap: Map<string, number> = new Map();
  decimalsMap.set(solanaNativeAddress, solanaNativeDecimals);
  decimalsMap.set(solanaNativeWrappedAddress, solanaNativeDecimals);
  mintAccounts.forEach((acc) => {
    if (!acc) return;
    decimalsMap.set(acc.pubkey.toString(), acc.decimals);
  });
  return mints.map((m) => decimalsMap.get(m.toString()) || null);
}
