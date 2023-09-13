import {
  AddressSystem,
  AddressSystemType,
  EvmNetworkIdType,
  MoveNetworkIdType,
  NetworkId,
  NetworkIdType,
  evmNetworks,
} from '@sonarwatch/portfolio-core';
import { isBlankAddressSui } from './isBlankAddressSui';
import { isBlankAddressAptos } from './isBlankAddressAptos';
import { isBlankAddressEvm } from './isBlankAddressEvm';

export async function getBlankNetworkIds(
  address: string,
  addressSystem: AddressSystemType
): Promise<NetworkIdType[]> {
  switch (addressSystem) {
    case AddressSystem.solana:
      return [];
    case AddressSystem.bitcoin:
      return [];
    case AddressSystem.evm:
      return getBlankNetworkIdsEvm(address);
    case AddressSystem.move:
      return getBlankNetworkIdsMove(address);
    case AddressSystem.sei:
      return [];
    default:
      return [];
  }
}

export async function getBlankNetworkIdsMove(
  address: string
): Promise<MoveNetworkIdType[]> {
  const promises = [
    isBlankAddressSui(address).then((isBlank): MoveNetworkIdType | null =>
      isBlank ? NetworkId.sui : null
    ),
    isBlankAddressAptos(address).then((isBlank): MoveNetworkIdType | null =>
      isBlank ? NetworkId.aptos : null
    ),
  ];
  return (await Promise.all(promises)).filter(
    (v) => v !== null
  ) as MoveNetworkIdType[];
}

const evmNetworkIds = evmNetworks.map((n) => n.id) as EvmNetworkIdType[];
export async function getBlankNetworkIdsEvm(
  address: string
): Promise<EvmNetworkIdType[]> {
  const promises = evmNetworkIds.map((n) => isBlankAddressEvm(n, address));
  const res = await Promise.all(promises);
  return res.reduce((acc: EvmNetworkIdType[], curr, i) => {
    if (curr) {
      acc.push(evmNetworkIds[i]);
    }
    return acc;
  }, []);
}
