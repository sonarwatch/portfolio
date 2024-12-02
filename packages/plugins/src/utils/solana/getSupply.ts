import { PublicKey } from '@solana/web3.js';
import {
  solanaNativeAddress,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { SolanaClient } from '../clients/types';
import { getParsedAccountInfo } from './getParsedAccountInfo';
import { mintAccountStruct } from './structs';

const solMints = [solanaNativeAddress, solanaNativeWrappedAddress];

export async function getSupply(
  connection: SolanaClient,
  mint: PublicKey
): Promise<BigNumber | null> {
  if (solMints.includes(mint.toString())) return null;

  const mintAccount = await getParsedAccountInfo(
    connection,
    mintAccountStruct,
    mint
  );
  return mintAccount
    ? mintAccount.supply.div(10 ** mintAccount.decimals)
    : null;
}
