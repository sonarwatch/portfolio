import { Address } from 'viem';
import { ElementRegistry } from '../elementbuilder/ElementRegistry';
import { LoggingContext, verboseLog } from './loggingUtils';

export const addStakedToRegistry = (
  registry: ElementRegistry,
  assetName: string,
  assetContractAddress: Address,
  amount: number,
  logCtx?: LoggingContext
): ElementRegistry => {
  const element = registry.addElementMultiple({
    label: 'Staked',
    name: assetName,
    tags: ['Staked'],
  });

  element.addAsset({
    address: assetContractAddress,
    amount,
  });

  if (logCtx) {
    verboseLog(
      {
        ...logCtx,
        element,
        assetContractAddress,
        amount,
      },
      'Added element to registry'
    );
  }

  return registry;
};
