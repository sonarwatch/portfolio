import { PublicKey } from '@solana/web3.js';
import { SolanaClient } from '../../../utils/clients/types';
import { aggregatorAccountStruct } from '../structs';
import { getValueFromAggregator } from './misc';
import { getParsedMultipleAccountsInfo } from '../../../utils/solana';

export async function getSwitchboardPrices(
  connection: SolanaClient,
  feedAddresses: PublicKey[]
): Promise<(number | null)[]> {
  const accounts = await getParsedMultipleAccountsInfo(
    connection,
    aggregatorAccountStruct,
    feedAddresses
  );
  return accounts.map((account) =>
    account ? getValueFromAggregator(account, 3600) : null
  );
}
