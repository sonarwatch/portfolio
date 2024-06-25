import { PublicKey } from '@solana/web3.js';
import { SolanaClient } from '../../../utils/clients/types';
import { PerpMarket, perpMarketStruct } from '../struct';
import { getParsedAccountInfo } from '../../../utils/solana/getParsedAccountInfo';
import { ParsedAccount } from '../../../utils/solana';

const perpMarkets: Map<string, ParsedAccount<PerpMarket> | null> = new Map();
const lastUpdates: Map<string, number> = new Map();
const perpMarketTtl = 3600000; // 1 hour

export async function getPerpMarket(
  perpMarketAdd: string,
  connection: SolanaClient
): Promise<ParsedAccount<PerpMarket> | null> {
  const lastUpdate = lastUpdates.get(perpMarketAdd);
  const perpMarket = perpMarkets.get(perpMarketAdd);

  if (!perpMarket || !lastUpdate || lastUpdate < Date.now() - perpMarketTtl) {
    const cPerpMarket = await getParsedAccountInfo(
      connection,
      perpMarketStruct,
      new PublicKey(perpMarketAdd)
    );

    perpMarkets.set(perpMarketAdd, cPerpMarket);
    lastUpdates.set(perpMarketAdd, Date.now());
    return cPerpMarket;
  }
  return perpMarket;
}
