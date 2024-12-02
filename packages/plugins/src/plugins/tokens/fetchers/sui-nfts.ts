import {
  NetworkId,
  parseTypeString,
  PortfolioAssetCollectible,
  PortfolioAssetCollectibleData,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSui } from '../../../utils/clients';
import { walletNftsPlatform } from '../constants';
import {
  NFTContentFields,
  SuiFrendFields,
  NftDisplayData,
} from '../../../utils/sui/types/nft';
import { getKiosksDynamicFieldsObjects } from '../../../utils/sui/getKioskObjects';
import { getOwnedObjectsPreloaded } from '../../../utils/sui/getOwnedObjectsPreloaded';

const suiFrendTraitMap: Map<number, string> = new Map([
  [0, 'skin'],
  [1, 'main_color'],
  [2, 'secondary_colo'],
  [3, 'expression'],
  [4, 'ears'],
]);

const executor: FetcherExecutor = async (owner: string) => {
  const client = getClientSui();
  const ownedObjects = await getOwnedObjectsPreloaded(client, owner);
  if (ownedObjects.length === 0) return [];

  const kioskObjects = await getKiosksDynamicFieldsObjects(ownedObjects, {
    showDisplay: true,
  });

  ownedObjects.push(...kioskObjects);

  const assets: PortfolioAssetCollectible[] = [];
  ownedObjects.forEach((object) => {
    // Filter non NFT object
    if (!object.data?.display?.data) return;

    const parsedType = parseTypeString(object.data.type);
    const collectionName = parsedType.struct;
    const subCollectionName = parsedType.keys?.at(0)?.root;

    const collectibleData: PortfolioAssetCollectibleData = {
      address: object.data.objectId,
      description: '',
      amount: 1,
      price: null,
      attributes: [],
    };
    const collectible: PortfolioAssetCollectible = {
      data: collectibleData,
      networkId: NetworkId.sui,
      type: 'collectible',
      value: null,
      attributes: {},
      name: undefined,
    };

    // Find general information
    if (object.data.display) {
      const displayData = object.data.display.data as NftDisplayData;
      if (displayData) {
        collectibleData.imageUri = displayData.image_url;
        collectible.name = displayData.name;
        collectibleData.description = displayData.description;
      }
    }

    if (object.data.content) {
      const nftContentFields = object.data.content.fields as NFTContentFields;

      // Find all attributes
      if (nftContentFields.attributes) {
        if (nftContentFields.attributes.fields) {
          if (nftContentFields.attributes.fields.contents) {
            nftContentFields.attributes.fields.contents.forEach((attribute) => {
              collectibleData.attributes?.push({
                trait_type: attribute.fields.key,
                value: attribute.fields.value,
              });
            });
          } else if (nftContentFields.attributes.fields.fields) {
            if (nftContentFields.attributes.fields.fields.fields.contents) {
              nftContentFields.attributes.fields.fields.fields.contents.forEach(
                (attribute) => {
                  collectibleData.attributes?.push({
                    trait_type: attribute.fields.key,
                    value: attribute.fields.value,
                  });
                }
              );
            }
          }
        } else if (collectionName === 'SuiFren') {
          // Specific SuiFrens case
          const suiFrenAttributes = object.data.content
            .fields as SuiFrendFields;
          suiFrenAttributes.attributes.forEach((value, index) => {
            collectibleData.attributes?.push({
              trait_type: suiFrendTraitMap.get(index),
              value,
            });
          });
          collectible.name = `${collectionName}:${subCollectionName}`;
        }
      }
      // Find additional informations
      if (nftContentFields.amount)
        collectibleData.amount = Number(nftContentFields.amount);

      if (nftContentFields.rarity)
        collectibleData.attributes?.push({
          trait_type: 'rarity',
          value: nftContentFields.rarity,
        });

      if (nftContentFields.edition)
        collectibleData.attributes?.push({
          trait_type: 'edition',
          value: nftContentFields.edition,
        });

      if (nftContentFields.tick) collectible.name = nftContentFields.tick;

      const number = nftContentFields.number ?? nftContentFields.number_id;
      if (number)
        collectible.name = collectible.name
          ? `${collectible.name} #${number}`
          : undefined;

      // Add Collection Information
      collectible.data.collection = {
        name: nftContentFields.collection_name ?? collectionName,
        id: object.data.type,
        floorPrice: null,
      };
    }
    assets.push(collectible);
  });

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
