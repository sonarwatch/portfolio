import { NSOwner } from '@sonarwatch/portfolio-core';
import { nameServices } from './nameServices';

export async function getOwner(name: string): Promise<NSOwner | null> {
  for (let i = 0; i < nameServices.length; i++) {
    const nameService = nameServices[i];
    if (nameService.checker.checker(name)) {
      const owner = await nameService.getOwner(name);
      if (!owner) return null;
      return {
        address: owner,
        addressSystem: nameService.checker.addressSystem,
      };
    }
  }
  return null;
}
