import { getClientAptos } from '../clients';

export async function isBlankAddressAptos(address: string) {
  const client = getClientAptos();
  const ressources = await client
    .getAccountResources({
      accountAddress: address,
    })
    .catch(() => []);
  return ressources.length === 0;
}
