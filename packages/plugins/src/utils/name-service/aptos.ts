import { NSName, NetworkId } from '@sonarwatch/portfolio-core';

export async function getOwnerAptos(name: string): Promise<string | null> {
  const response = await fetch(
    `https://www.aptosnames.com/api/mainnet/v1/address/${name}`
  );
  const { address } = await response.json();
  return address;
}
export async function getNamesAptos(address: string): Promise<NSName[]> {
  const response = await fetch(
    `https://www.aptosnames.com/api/mainnet/v1/primary-name/${address}`
  );
  const { name } = await response.json();
  return [
    {
      name,
      networkId: NetworkId.aptos,
    },
  ];
}
