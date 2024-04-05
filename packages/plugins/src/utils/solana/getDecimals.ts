import { PublicKey } from '@solana/web3.js';
import {
  solanaNativeAddress,
  solanaNativeDecimals,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import { SolanaClient } from '../clients/types';
import { getParsedAccountInfo } from './getParsedAccountInfo';
import { mintAccountStruct } from './structs';

const solMints = [solanaNativeAddress, solanaNativeWrappedAddress];

export async function getDecimals(
  connection: SolanaClient,
  mint: PublicKey
): Promise<number | null> {
  if (solMints.includes(mint.toString())) return solanaNativeDecimals;

  const mintAccount = await getParsedAccountInfo(
    connection,
    mintAccountStruct,
    mint
  );
  return mintAccount?.decimals || null;
}
