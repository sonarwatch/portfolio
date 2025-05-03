import {
  CollectibleCollection,
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { CollectionGroup, HeliusAsset } from './types';
import { getTopCollection } from "./getTopCollection";

export async function heliusAssetToAssetCollectible(
  asset: HeliusAsset,
  cache: Cache,
  props?: {
    tags?: string[];
    collection?: { floorPrice?: number; name?: string };
  }
): Promise<PortfolioAssetCollectible | null> {
  // Tags
  const tags: string[] | undefined = [];
  if (asset.compression.compressed) tags.push('compressed');
  if (asset.inscription) tags.push('inscription');

  if (props?.tags?.length) tags.push(...props.tags);

  let amount = 1;
  let collection: CollectibleCollection | undefined;

  const decimals = asset.token_info?.decimals;
  const balance = asset.token_info?.balance;
  if (decimals !== undefined && decimals !== 0) return null;

  // Amount
  if (balance && balance !== 0) {
    amount = balance;
    tags.push('sft');
  }

  if (asset.spl20) {
    const { amt, op, p, tick } = asset.spl20;
    if (p !== 'spl-20') return null;
    if (op !== 'mint') return null;
    if (amt === undefined) return null;
    amount = parseInt(amt, 10);
    collection = {
      floorPrice: null,
      id: `${tick}-spl-20`,
      name: tick.toUpperCase(),
    };
    tags.push('spl20');
  }

  // load cached collections
  let tensorTopCollection = await getTopCollection(cache);

  // Collection
  const collectionGroup = asset.grouping.find(
    (g) => g.group_key === 'collection'
  ) as CollectionGroup | undefined;
  if (collectionGroup) {
    collection = {
      floorPrice: props?.collection?.floorPrice ?? null,
      id: collectionGroup.group_value,
      name:
        collectionGroup.collection_metadata?.name ||
        collection?.name ||
        props?.collection?.name,
    };
  }

  const key = collection?.id || asset.content?.metadata?.symbol
  if (!!key && !asset.compression.compressed) {
    let collectionMetaData = tensorTopCollection.get(key);

    if (collectionMetaData) {
      collection = {
        ...collection,
        floorPrice: collectionMetaData.floorPrice,
        name: collectionMetaData.name,
      }
    }
  }

  return {
    type: PortfolioAssetType.collectible,
    attributes: {
      tags: tags.length > 0 ? tags : [],
    },
    name:
      asset.content.metadata.name ||
      collection?.name ||
      props?.collection?.name,
    data: {
      address: asset.id,
      amount,
      price: (props?.collection?.floorPrice || collection?.floorPrice) ?? null,
      name:
        asset.content.metadata.name ||
        collection?.name ||
        props?.collection?.name,
      dataUri: asset.content.json_uri,
      imageUri: asset.content.links?.image,
      attributes: asset.content.metadata.attributes,
      collection,
    },
    networkId: NetworkId.solana,
    imageUri: asset.content.links?.image,
    value: (props?.collection?.floorPrice || collection?.floorPrice ) ?? null,
  };
}
