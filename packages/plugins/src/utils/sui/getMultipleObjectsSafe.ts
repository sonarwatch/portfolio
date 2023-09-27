import { JsonRpcProvider } from '@mysten/sui.js';

export default async function getMultipleSuiObjectsSafe(
  client: JsonRpcProvider,
  ids: string[],
  options?: {
    showContent?: boolean;
    showType?: boolean;
    showBcs?: boolean;
    showDisplay?: boolean;
    showOwner?: boolean;
    showPreviousTransaction?: boolean;
    showStorageRebate?: boolean;
  }
) {
  const objects = [];
  for (let i = 0; i < ids.length / 50; i++) {
    const tempAddresses = ids.slice(i * 50, i * 50 + 50);
    const tempObjects = await client.multiGetObjects({
      ids: tempAddresses,
      options,
    });
    objects.push(...tempObjects);
  }
  return objects;
}
