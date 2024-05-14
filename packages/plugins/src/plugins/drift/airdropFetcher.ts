import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { driftMint, platform, platformId } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { claimStart, fetchAirdropAmount } from './helpersAirdrop';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  // const client = getClientSolana();
  // const claimStatus = deriveClaimStatus(owner, res.data.merkle_tree, '');
  // const account = await client.getAccountInfo(claimStatus);
  // if (account) return [];

  const amount = await fetchAirdropAmount(owner);
  if (amount === 0) return [];

  const tokenPrice = driftMint
    ? await cache.getTokenPrice(driftMint, NetworkId.solana)
    : undefined;

  const asset: PortfolioAsset = tokenPrice
    ? tokenPriceToAssetToken(
        tokenPrice.address,
        amount,
        NetworkId.solana,
        tokenPrice
      )
    : {
        type: 'generic',
        data: {
          amount,
          name: 'DRIFT',
          price: null,
          imageUri: platform.image,
        },
        attributes: {
          lockedUntil: claimStart,
        },
        networkId: NetworkId.solana,
        value: null,
      };

  return [
    {
      networkId: NetworkId.solana,
      platformId,
      type: PortfolioElementType.multiple,
      data: {
        assets: [asset],
      },
      value: null,
      label: 'Airdrop',
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
