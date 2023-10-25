import { AddressSystemType } from '@sonarwatch/portfolio-core';
import { nameServices } from './nameServices';

export async function getNames(
  address: string,
  addressSystem: AddressSystemType
): Promise<string[]> {
  const names: string[] = [];
  for (let i = 0; i < nameServices.length; i++) {
    const nameService = nameServices[i];
    if (nameService.checker.addressSystem !== addressSystem) continue;

    const cNames = await nameService.getNames(address);
    names.push(...cNames);
  }
  return names;
}
