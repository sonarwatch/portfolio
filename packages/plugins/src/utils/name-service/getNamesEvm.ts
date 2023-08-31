import { NetworkId } from '@sonarwatch/portfolio-core';
import { Name } from './types';
import { getNamesEthereum } from './getNamesEthereum';
import { getNamesAvalanche } from './getNamesAvalanche';

export async function getNamesEvm(address: string): Promise<Name[]> {
  const promises = [
    getNamesEthereum(address).then((names): Name[] =>
      names.map((name) => ({
        name,
        networkId: NetworkId.ethereum,
      }))
    ),
    getNamesAvalanche(address).then((names): Name[] =>
      names.map((name) => ({
        name,
        networkId: NetworkId.avalanche,
      }))
    ),
  ];
  return (await Promise.all(promises)).flat(1);
}
