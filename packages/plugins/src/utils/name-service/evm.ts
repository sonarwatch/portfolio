import { NSName, NetworkId } from '@sonarwatch/portfolio-core';
import { getNamesEthereum } from './ethereum';
import { getNamesAvalanche } from './avalanche';

export async function getNamesEvm(address: string): Promise<NSName[]> {
  const promises = [
    getNamesEthereum(address).then((names): NSName[] =>
      names.map((name) => ({
        name,
        networkId: NetworkId.ethereum,
      }))
    ),
    getNamesAvalanche(address).then((names): NSName[] =>
      names.map((name) => ({
        name,
        networkId: NetworkId.avalanche,
      }))
    ),
  ];
  return (await Promise.all(promises)).flat(1);
}
