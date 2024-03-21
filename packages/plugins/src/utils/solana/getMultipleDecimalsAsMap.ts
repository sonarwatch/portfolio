import { PublicKey } from '@solana/web3.js';
import {
  solanaNativeAddress,
  solanaNativeDecimals,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import { SolanaClient } from '../clients/types';
import { mintAccountStruct } from './structs';
import { getParsedMultipleAccountsInfo } from './getParsedMultipleAccountsInfo';

export async function getMultipleDecimalsAsMap(
  connection: SolanaClient,
  mints: PublicKey[]
): Promise<Map<string, number>> {
  const mintsSet = new Set(mints.map((m) => m.toString()));
  const decimalsMap: Map<string, number> = new Map();

  if (mintsSet.has(solanaNativeAddress)) {
    decimalsMap.set(solanaNativeAddress, solanaNativeDecimals);
    mintsSet.delete(solanaNativeAddress);
  }
  if (mintsSet.has(solanaNativeWrappedAddress)) {
    decimalsMap.set(solanaNativeWrappedAddress, solanaNativeDecimals);
    mintsSet.delete(solanaNativeWrappedAddress);
  }

  const mintAccounts = await getParsedMultipleAccountsInfo(
    connection,
    mintAccountStruct,
    Array.from(mintsSet).map((m) => new PublicKey(m))
  );
  mintAccounts.forEach((acc) => {
    if (!acc) return;
    decimalsMap.set(acc.pubkey.toString(), acc.decimals);
  });
  return decimalsMap;
}
