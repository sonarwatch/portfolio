import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { distributorPid, driftMint, platform, platformId } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { claimStart, fetchAirdropInfo } from './helpersAirdrop';
import { deriveClaimStatus } from '../jupiter/helpers';
import { getClientSolana } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const { amount, merkle } = await fetchAirdropInfo(owner);
  if (amount === 0) return [];

  const client = getClientSolana();
  const claimStatus = deriveClaimStatus(owner, merkle, distributorPid);
  const account = await client.getAccountInfo(claimStatus);
  if (account) return [];

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
