import {
  AddressSystem,
  AddressSystemType,
  NetworkId,
  formatAddress,
} from '@sonarwatch/portfolio-core';
import { getNamesEvm } from './getNamesEvm';
import { Name } from './types';
import { getNamesSolana } from './getNamesSolana';

export async function getNames(
  address: string,
  addressSystem: AddressSystemType
): Promise<Name[]> {
  const fAddress = formatAddress(address, addressSystem);
  switch (addressSystem) {
    case AddressSystem.bitcoin:
      return [];
    case AddressSystem.evm:
      return getNamesEvm(fAddress);
    case AddressSystem.solana:
      return getNamesSolana(fAddress).then((names): Name[] =>
        names.map((name) => ({
          name,
          networkId: NetworkId.solana,
        }))
      );
    default:
      return [];
  }
}
