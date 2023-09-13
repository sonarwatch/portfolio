import { getClientSui } from '../clients';

export async function isBlankAddressSui(address: string) {
  const client = getClientSui();
  const coinsBalances = await client.getAllBalances({ owner: address });
  return coinsBalances.length === 0;
}
