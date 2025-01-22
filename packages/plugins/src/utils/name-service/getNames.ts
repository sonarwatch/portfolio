import { AddressSystemType } from '@sonarwatch/portfolio-core';
import { nameServices } from './nameServices';

export async function getNames(
  address: string,
  addressSystem: AddressSystemType
): Promise<string[]> {
  return (
    await Promise.all(
      nameServices.map((nameService) => {
        if (nameService.checker.addressSystem !== addressSystem) return [];

        return nameService.getNames(address);
      })
    )
  ).flat();
}
