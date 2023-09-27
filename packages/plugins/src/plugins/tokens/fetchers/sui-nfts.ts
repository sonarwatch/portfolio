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
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSui } from '../../../utils/clients';
import { DisplayInfo, KioskContent, SuiNFTMetadata } from '../types';
import getFormattedCollectionNameAndId from '../../../utils/sui/getFormattedCollectionNameAndId';
import { walletNftsPlatform } from '../constants';
import { kioskItemType, obKioskStructType } from '../../../utils/sui/constants';
import getMultipleSuiObjectsSafe from '../../../utils/sui/getMultipleObjectsSafe';

const executor: FetcherExecutor = async (owner: string) => {
  const client = getClientSui();

  const assets: PortfolioAssetCollectible[] = [];
  let obKioskObjects;
  let ownedNFTsObjects;
  let cursor;
  const kioskItemsAddresses: Set<string> = new Set();

  do {
    obKioskObjects = await client.getOwnedObjects({
      owner,
      filter: {
        StructType: obKioskStructType,
      },
      options: {
        showContent: true,
      },
      cursor,
    });
    cursor = obKioskObjects.nextCursor;

    for (const obKioskObject of obKioskObjects.data) {
      if (!obKioskObject.data || !obKioskObject.data.content) continue;

      const contentObject = obKioskObject.data.content as KioskContent;
      if (!contentObject.fields.kiosk) continue;

      const dynamicFields = await client.getDynamicFields({
        parentId: contentObject.fields.kiosk,
      });
      if (dynamicFields.data.length === 0) continue;

      const dynamicObjects = dynamicFields.data.filter(
        (field) => field.type === 'DynamicObject'
      );
      if (
        dynamicObjects.length !== 1 ||
        dynamicObjects[0].name.type !== kioskItemType
      )
        continue;
      kioskItemsAddresses.add(dynamicObjects[0].objectId);
    }
  } while (obKioskObjects.hasNextPage);

  let nftKioskObjects = await getMultipleSuiObjectsSafe(
    client,
    Array.from(kioskItemsAddresses),
    {
      showContent: true,
      showDisplay: true,
      showType: true,
      showOwner: true,
    }
  );

  cursor = undefined;
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

    const ownedObjects =
      nftKioskObjects.length > 0
        ? [...ownedNFTsObjects.data, ...nftKioskObjects]
        : ownedNFTsObjects.data;

    for (const ownedObject of ownedObjects) {
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
    nftKioskObjects = [];
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
  id: `${walletNftsPlatform.id}-${NetworkId.sui}`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
