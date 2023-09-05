import {
  AddressSystem,
  AddressSystemType,
  NetworkId,
  formatAddress,
} from '@sonarwatch/portfolio-core';
import { getNamesEvm } from './evm';
import { NSName } from './types';
import { getNamesSolana } from './solana';

export async function getNames(
  address: string,
  addressSystem: AddressSystemType
): Promise<NSName[]> {
  const fAddress = formatAddress(address, addressSystem);
  switch (addressSystem) {
    case AddressSystem.bitcoin:
      return [];
    case AddressSystem.evm:
      return getNamesEvm(fAddress);
    case AddressSystem.solana:
      return getNamesSolana(fAddress).then((names): NSName[] =>
        names.map((name) => ({
          name,
          networkId: NetworkId.solana,
        }))
      );
    default:
      return [];
  }
}
