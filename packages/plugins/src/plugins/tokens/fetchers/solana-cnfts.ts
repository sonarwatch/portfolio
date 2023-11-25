import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getAssetsByOwnerDas } from '../../../utils/solana/getAssetsByOwnerDas';
import { walletNftsPlatform, walletTokensPlatform } from '../constants';
import { getRpcEndpoint } from '../../../utils/clients/constants';

const executor: FetcherExecutor = async (owner: string) => {
  const rpcEndpoint = getRpcEndpoint(NetworkId.solana);
  const list = await getAssetsByOwnerDas(rpcEndpoint, owner);

  const assets: PortfolioAssetCollectible[] = [];
  const items = list.items.filter((i) => {
    const isCompressed = i.compression.compressed;
    const isSplNft = i.spl20 === null && i.inscription !== null;
    return isCompressed || isSplNft;
  });
  items.forEach((i) => {
    assets.push({
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
    });
  });
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
