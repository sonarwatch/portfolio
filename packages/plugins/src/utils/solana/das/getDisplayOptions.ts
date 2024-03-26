import { DisplayOptions } from './types';

export function getDisplayOptions(
  displayOptions?: DisplayOptions
): Required<DisplayOptions> {
  return {
    showCollectionMetadata: displayOptions?.showCollectionMetadata ?? true,
    showFungible: displayOptions?.showFungible ?? true,
    showGrandTotal: displayOptions?.showGrandTotal ?? true,
    showInscription: displayOptions?.showInscription ?? true,
    showNativeBalance: displayOptions?.showNativeBalance ?? true,
    showUnverifiedCollections:
      displayOptions?.showUnverifiedCollections ?? true,
  };
}
