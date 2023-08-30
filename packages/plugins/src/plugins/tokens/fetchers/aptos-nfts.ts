/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Network, Provider } from 'aptos';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import runInBatch from '../../../utils/misc/runInBatch';
import { getImagefromUri } from '../../../utils/misc/getImagefromUri';
import { walletNftsPlatform } from '../constants';

const prefix = 'nft-images-aptos';
const noImageValue = 'noimage';

type TokenInfo = {
  __typename?: 'current_token_ownerships_v2';
  token_standard: string;
  is_fungible_v2?: boolean | null;
  is_soulbound_v2?: boolean | null;
  property_version_v1: any;
  table_type_v1?: string | null;
  token_properties_mutated_v1?: any | null;
  amount: any;
  last_transaction_timestamp: any;
  last_transaction_version: any;
  storage_id: string;
  owner_address: string;
  current_token_data?: {
    __typename?: 'current_token_datas_v2';
    token_name: string;
    token_data_id: string;
    token_uri: string;
    token_properties: any;
    supply: any;
    maximum?: any | null;
    last_transaction_version: any;
    last_transaction_timestamp: any;
    largest_property_version_v1?: any | null;
    current_collection?: {
      __typename?: 'current_collections_v2';
      collection_name: string;
      creator_address: string;
      description: string;
      uri: string;
      collection_id: string;
      last_transaction_version: any;
      current_supply: any;
      mutable_description?: boolean | null;
      total_minted_v2?: any | null;
      table_handle_v1?: string | null;
      mutable_uri?: boolean | null;
    } | null;
  } | null;
};

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const provider = new Provider(Network.MAINNET);
  const ownedTokensRes = await provider.getOwnedTokens(owner);
  const nfts = ownedTokensRes.current_token_ownerships_v2.filter(
    (nft) => nft.current_token_data
  );

  const cachedImages = await cache.getItems<string>(
    nfts
      .map((o) => (o.current_token_data ? o.current_token_data.token_uri : []))
      .flat(),
    {
      prefix,
      networkId: NetworkId.aptos,
    }
  );

  const images: Map<string, string> = new Map();
  const missings: TokenInfo[] = [];
  nfts.forEach(async (o, i) => {
    if (!o.current_token_data) return;
    const cachedImage = cachedImages[i];
    const address = o.current_token_data.token_uri;
    if (cachedImage) {
      images.set(address, cachedImage);
    } else missings.push(o);
  });

  const res = await runInBatch(
    missings.map(
      (o) => () =>
        getImagefromUri(o.current_token_data?.token_uri, NetworkId.aptos, cache)
    ),
    10
  );

  const promises = res.map((r, i) => {
    const image = r.status !== 'rejected' ? r.value : undefined;
    const address = missings[i].current_token_data?.token_uri;
    if (!address) return undefined;
    if (r.status === 'rejected' || !image) {
      return cache.setItem(address, noImageValue, {
        prefix,
        networkId: NetworkId.aptos,
      });
    }
    images.set(address, image);
    return cache.setItem(address, image, {
      prefix,
      networkId: NetworkId.aptos,
    });
  });
  await Promise.allSettled(promises);

  const assets: PortfolioAssetCollectible[] = nfts
    .map((nft) => {
      if (!nft.current_token_data) return [];
      const address = nft.current_token_data.token_data_id;
      const dataUri = nft.current_token_data.token_uri;

      const { amount } = nft;

      let image = images.get(dataUri);
      if (image === noImageValue) image = undefined;

      return {
        networkId: NetworkId.aptos,
        type: PortfolioAssetType.collectible,
        value: null,
        data: {
          address,
          amount,
          dataUri,
          price: null,
          value: null,
          floorPrice: null,
          image,
          imageUri: image,
          name: nft.current_token_data.token_name,
          collectionId:
            nft.current_token_data.current_collection?.collection_id,
        },
      };
    })
    .flat();

  if (assets.length === 0) return [];
  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.aptos,
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
  id: `${walletNftsPlatform.id}-${NetworkId.aptos}`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
