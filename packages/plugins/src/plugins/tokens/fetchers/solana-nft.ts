import {
  CollectibleCollection,
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
  PortfolioElement,
  PortfolioElementType,
  walletNftsPlatformId,
} from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { Cache } from '../../../Cache';
import { getAssetsByOwnerDas } from '../../../utils/solana/das/getAssetsByOwnerDas';
import { CollectionGroup, HeliusAsset } from '../../../utils/solana/das/types';
import getSolanaDasEndpoint from '../../../utils/clients/getSolanaDasEndpoint';

export function heliusAssetToAssetCollectible(
  asset: HeliusAsset,
  props?: {
    tags?: string[];
    collection?: { floorPrice?: number; name?: string };
  }
): PortfolioAssetCollectible | null {
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
      price: props?.collection?.floorPrice ?? null,
      name:
        asset.content.metadata.name ||
        collection?.name ||
        props?.collection?.name,
      dataUri: asset.content.json_uri,
      attributes: asset.content.metadata.attributes,
      collection,
    },
    networkId: NetworkId.solana,
    imageUri: asset.content.links?.image,
    value: props?.collection?.floorPrice ?? null,
  };
}

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const dasEndpoint = getSolanaDasEndpoint();
  const items = await getAssetsByOwnerDas(dasEndpoint, owner, {
    showNativeBalance: false,
    showGrandTotal: false,
    showInscription: false,
  });

  const nftAssets: PortfolioAssetCollectible[] = [];

  for (let i = 0; i < items.length; i++) {
    const asset = items[i];
    const nftAsset = heliusAssetToAssetCollectible(asset);
    if (nftAsset) {
      nftAssets.push(nftAsset);
    }
  }
  const elements: PortfolioElement[] = [];
  if (nftAssets.length !== 0) {
    elements.push({
      type: PortfolioElementType.multiple,
      networkId: NetworkId.solana,
      platformId: walletNftsPlatformId,
      label: 'Wallet',
      value: null,
      data: {
        // Limit NFTs to 1K, to avoid fetcherResult to be too big
        assets: nftAssets.slice(0, 1000),
      },
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${walletNftsPlatformId}-solana`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
