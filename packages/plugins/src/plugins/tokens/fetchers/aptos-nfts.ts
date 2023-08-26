import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioElementMultiple,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientAptos } from '../../../utils/clients';
import { walletNftsPlatform } from '../../../platforms';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();

  const nfts = await client.getAccountResources(owner);
  console.log('constexecutor:FetcherExecutor= ~ nfts:', nfts);

  // https://github.com/aptos-gaming/upgradable-nft-staking/blob/main/frontend/src/components/TokensList.tsx#L46

  const assets: PortfolioAssetCollectible[] = [];
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
