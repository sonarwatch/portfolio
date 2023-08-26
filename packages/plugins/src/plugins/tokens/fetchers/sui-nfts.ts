import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import {
  SuiMoveObject,
  getObjectDisplay,
  getObjectFields,
  getObjectId,
  getObjectType,
} from '@mysten/sui.js';
import { walletNftsPlatform } from '../../../platforms';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSui } from '../../../utils/clients';
import { Cache } from '../../../Cache';
import { DisplayInfo, SuiNFTMetadata } from '../types';
import getFormattedCollectionNameAndId from '../../../utils/sui/getFormattedCollectionNameAndId';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();

  const assets: PortfolioAssetCollectible[] = [];
  let ownedNFTsObjects;
  let cursor;
  do {
    ownedNFTsObjects = await client.getOwnedObjects({
      owner,
      options: {
        showContent: true,
        showType: true,
        showDisplay: true,
        showOwner: true,
      },
      cursor,
    });
    cursor = ownedNFTsObjects.nextCursor;

    for (const ownedObject of ownedNFTsObjects.data) {
      if (!ownedObject.data || !ownedObject.data.content) continue;
      const type = getObjectType(ownedObject);
      if (!type) continue;

      const object = ownedObject.data.content as SuiMoveObject;
      const display = getObjectDisplay(ownedObject);
      const displayData = display.data as DisplayInfo;
      const metadatas = getObjectFields(object) as SuiNFTMetadata;
      if (displayData === null && metadatas === null) continue;
      const objectId = getObjectId(ownedObject);
      const { collectionName, collectionId } =
        getFormattedCollectionNameAndId(type);

      let imageUri;
      let name;
      if (displayData && displayData.image_url) {
        imageUri = displayData.image_url;
        name = displayData.name;
      } else if (metadatas && (metadatas.image_url || metadatas.url)) {
        imageUri = metadatas.image_url || metadatas.url;
        name = metadatas.name;
      } else continue;

      assets.push({
        networkId: NetworkId.sui,
        type: PortfolioAssetType.collectible,
        value: null,
        data: {
          address: objectId,
          amount: 1,
          price: null,
          imageUri,
          name,
          collection: {
            floorPrice: null,
            id: collectionId || '',
            name: collectionName || '',
          },
        },
      });
      continue;
    }
  } while (ownedNFTsObjects.hasNextPage);

  if (assets.length === 0) return [];
  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.sui,
    platformId: walletNftsPlatform.id,
    label: 'Wallet',
    value: null,
    data: {
      assets,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${walletNftsPlatform.id}-sui`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
