import BigNumber from 'bignumber.js';
import { Address } from 'viem';
import { ElementRegistry } from '../elementbuilder/ElementRegistry';
import { LoggingContext, verboseLog } from './loggingUtils';

export const addStakedToRegistry = (
  registry: ElementRegistry,
  assetName: string,
  assetContractAddress: Address,
  amount: number | BigNumber | string,
  logCtx?: LoggingContext
): ElementRegistry => {
  const element = registry.addElementMultiple({
    label: 'Staked',
    name: assetName,
    tags: ['Staked'],
  });

  // Extracting as a variable to be able to log below.
  // This is needed because the call to addAsset() adds a `AssetTokenBuilder` and the log
  // doesn't show valuable information.
  const addAssetParams = {
    address: assetContractAddress,
    amount,
  } as const;
  element.addAsset(addAssetParams);

  if (logCtx) {
    verboseLog(
      {
        ...logCtx,
        element,
        addAssetParams,
      },
      'Added element to registry'
    );
  }

  // We return the registry to allow for method chaining
  return registry;
};
