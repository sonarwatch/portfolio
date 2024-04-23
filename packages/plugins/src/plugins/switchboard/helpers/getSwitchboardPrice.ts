import { PublicKey } from '@solana/web3.js';
import { SolanaClient } from '../../../utils/clients/types';
import { getSwitchboardPrices } from './getSwitchboardPrices';

export async function getSwitchboardPrice(
  connection: SolanaClient,
  feedAddress: PublicKey
): Promise<number | null> {
  return (await getSwitchboardPrices(connection, [feedAddress]))[0];
}
