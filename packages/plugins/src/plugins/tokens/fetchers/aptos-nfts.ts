/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Network, Provider } from 'aptos';
import axios, { AxiosResponse } from 'axios';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletNftsPlatform } from '../../../platforms';
import runInBatch from '../../../utils/misc/runInBatch';

const prefix = 'nft-images-aptos';
const noImageValue = 'noimage';

type NftMetadata = {
  name: string;
  description?: string;
  image: string;
  dna?: string;
  edition?: number;
  date?: number;
  attributes?: { trait_type: string; value: string }[];
  compiler?: string;
};

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
      .map((o) =>
        o.current_token_data ? o.current_token_data.token_data_id : []
      )
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
    const tokenUri = o.current_token_data.token_uri;
    const cachedImage =
      cachedImages[i] || isAnImageLink(tokenUri) ? tokenUri : undefined;
    const address = o.current_token_data.token_data_id;
    if (cachedImage) {
      images.set(address, cachedImage);
    } else missings.push(o);
  });

  const res: PromiseSettledResult<AxiosResponse<NftMetadata> | undefined>[] =
    await runInBatch(
      missings.map(
        (o) => () =>
          axios
            .get(getQueryableUrlFromAnyUrl(o.current_token_data?.token_uri))
            .catch(() => undefined)
      ),
      5
    );

  const promises = res.map((r, i) => {
    const image = r.status !== 'rejected' ? r.value?.data.image : undefined;
    const address = missings[i].current_token_data?.token_data_id;
    if (!address) return undefined;
    if (r.status === 'rejected' || !image) {
      return cache.setItem(address, noImageValue, {
        prefix,
        networkId: NetworkId.aptos,
      });
    }
    const imageUrl = getQueryableUrlFromAnyUrl(image);
    images.set(address, imageUrl);
    return cache.setItem(address, imageUrl, {
      prefix,
      networkId: NetworkId.aptos,
    });
  });
  await Promise.allSettled(promises);

  const assets: PortfolioAssetCollectible[] = nfts
    .map((nft) => {
      if (!nft.current_token_data) return [];
      const address = nft.current_token_data.token_data_id;

      const { amount } = nft;

      let image = images.get(address);
      if (image === noImageValue) image = undefined;

      return {
        networkId: NetworkId.aptos,
        type: PortfolioAssetType.collectible,
        value: null,
        data: {
          address,
          amount,
          dataUri: nft.current_token_data.token_uri,
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

function getQueryableUrlFromAnyUrl(metadataUrl: string | undefined): string {
  if (!metadataUrl) return '';
  if (metadataUrl.startsWith('ipfs')) {
    let url = metadataUrl.replace('ipfs://', '');
    const num = url.lastIndexOf('/');
    url = `https://${url.slice(0, num)}.ipfs.dweb.link${url.slice(num)}`;
    return url;
  }
  if (metadataUrl.startsWith('https://')) {
    return metadataUrl;
  }
  return '';
}

function isAnImageLink(url: string | undefined): boolean {
  if (!url) return true;
  return url.includes('.png') || url.includes('.jpeg');
}
