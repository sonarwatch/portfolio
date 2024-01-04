import { HeliusAsset } from './types';

export function isHeliusFungibleAsset(heliusAsset: HeliusAsset) {
  return (
    (heliusAsset.interface === 'FungibleToken' ||
      heliusAsset.interface === 'FungibleAsset') &&
    heliusAsset.token_info !== undefined
  );
}
