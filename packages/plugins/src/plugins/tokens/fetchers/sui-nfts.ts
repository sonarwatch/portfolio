import {
  CollectibleAttribute,
  NetworkId,
  parseTypeString,
  PortfolioAssetCollectible,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSui } from '../../../utils/clients';
import { walletNftsPlatform } from '../constants';
import { getOwnedObjects } from '../../../utils/sui/getOwnedObjects';
import { ParsedData } from '../../../utils/sui/types';
import { NftDisplayData, NftStruct } from '../../../utils/sui/structs/nft';
import { getKiosksObjects } from '../../../utils/sui/getKioskObjects';

const executor: FetcherExecutor = async (owner: string) => {
  const client = getClientSui();
  const ownedObjects = await getOwnedObjects(client, owner, {
    options: {
      showDisplay: true,
    },
  });
  if (ownedObjects.length === 0) return [];
  const nftObjects = [...ownedObjects.filter((o) => o.data?.display?.data)];

  const kioskObjects = await getKiosksObjects(ownedObjects, {
    showContent: true,
  });
  nftObjects.push(...kioskObjects);

  const assets: PortfolioAssetCollectible[] = [];
  nftObjects.forEach((object) => {
    if (!object.data) return;

    if (object.data.type.includes('kiosk')) return;

    const display: NftDisplayData | null | undefined =
      object.data.display?.data;
    const content = object.data.content as ParsedData<NftStruct>;

    let attributes: CollectibleAttribute[] = [];
    if (content.fields?.attributes?.fields) {
      if (content.fields.attributes.fields.map?.fields?.contents) {
        attributes = content.fields.attributes.fields.map.fields.contents?.map(
          (c) => ({
            trait_type: c.fields.key,
            value: c.fields.value,
          })
        );
      } else if (content.fields.attributes.fields.contents) {
        const objAttributes = content.fields.attributes.fields.contents;
        for (const index in objAttributes) {
          if (objAttributes[index]) {
            const { value, key } = objAttributes[index].fields;
            attributes.push({ trait_type: key, value });
          }
        }
      }
    }
    const collectionName = parseTypeString(object.data.type).struct;
    assets.push({
      networkId: NetworkId.sui,
      type: PortfolioAssetType.collectible,
      value: null,
      attributes: {},
      name:
        display?.name ||
        content.fields.name ||
        content.fields.tick ||
        (collectionName && content.fields.number)
          ? `${collectionName} #${content.fields.number}`
          : collectionName,
      data: {
        collection: {
          id: object.data.type,
          floorPrice: null,
          name: collectionName,
        },
        address: object.data.objectId,
        amount: Number(content.fields.amount || 1),
        price: null,
        description: display?.description || content.fields.description,
        imageUri:
          display?.image_url || content.fields.url || content.fields.image_url,
        name: display?.name || content.fields.name || content.fields.tick,
        attributes,
      },
    });
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
