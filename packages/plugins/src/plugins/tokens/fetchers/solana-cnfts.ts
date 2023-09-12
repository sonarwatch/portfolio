import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getAssetsByOwner } from '../../../utils/solana/getAssetsByOwner';
import { walletNftsPlatform, walletTokensPlatform } from '../constants';
import { getRpcEndpoint } from '../../../utils/clients/constants';

const executor: FetcherExecutor = async (owner: string) => {
  const rpcEndpoint = getRpcEndpoint(NetworkId.solana);
  const list = await getAssetsByOwner(rpcEndpoint, owner);

  const cNftsItems = list.items.filter((i) => i.compression.compressed);
  const assets: PortfolioAssetCollectible[] = cNftsItems.map((i) => ({
    networkId: NetworkId.solana,
    type: PortfolioAssetType.collectible,
    value: null,
    data: {
      address: i.id,
      amount: 1,
      price: null,
      name: i.content.metadata.name,
      imageUri: i.content.files.find((f) =>
        f.mime?.toLocaleLowerCase().startsWith('image')
      )?.uri,
      dataUri: i.content.json_uri,
    },
  }));
  if (assets.length === 0) return [];
  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.solana,
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
  id: `${walletTokensPlatform.id}-solana-cnfts`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
