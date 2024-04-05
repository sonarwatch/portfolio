import {
  NetworkId,
  NetworkIdType,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, wMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getAccountPubkey, getAllocation } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

export default function getPositionsV2Fetcher(
  networkId: NetworkIdType
): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const allocation = await getAllocation(owner, networkId);
    if (allocation === 0) return [];

    const client = getClientSolana();
    const account = await client.getAccountInfo(getAccountPubkey(owner));

    if (account) return [];

    const tokenPrice = await cache.getTokenPrice(wMint, NetworkId.solana);
    const asset = tokenPriceToAssetToken(
      wMint,
      allocation,
      NetworkId.solana,
      tokenPrice
    );

    return [
      {
        type: PortfolioElementType.multiple,
        label: 'Rewards',
        networkId: NetworkId.solana,
        platformId,
        name: 'Airdrop',
        data: {
          assets: [{ ...asset, attributes: { isClaimable: true } }],
        },
        value: asset.value,
      },
    ];
  };

  return {
    id: `${platformId}-airdrop`,
    networkId: NetworkId.solana,
    executor,
  };
}
