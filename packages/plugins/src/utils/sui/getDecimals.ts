import { SuiClient } from '../clients/types';

export async function getDecimals(
  client: SuiClient,
  coinType: string
): Promise<number | null> {
  const coinMetadata = await client.getCoinMetadata({ coinType });
  if (coinMetadata) return coinMetadata.decimals;
  return null;
}
