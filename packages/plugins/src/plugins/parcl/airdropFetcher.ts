import {
  AirdropUserStatus,
  NetworkId,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, prclMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { airdropStatics, fetchAirdrop } from './helpersAirdrop';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  if (Date.now() > airdropStatics.claimEnd) return [];

  const client = getClientSolana();
  const airdrop = await fetchAirdrop(owner, client, cache);
  if (
    airdrop.userStatus !== AirdropUserStatus.claimable &&
    airdrop.userStatus !== AirdropUserStatus.claimableLater
  )
    return [];
  if (!airdrop.amount) return [];

  const asset = tokenPriceToAssetToken(
    prclMint,
    airdrop.amount,
    NetworkId.solana,
    undefined,
    airdrop.price || undefined,
    { isClaimable: true }
  );

  return [
    {
      value: asset.value,
      type: PortfolioElementType.multiple,
      platformId,
      networkId: NetworkId.solana,
      label: 'Airdrop',
      data: { assets: [asset] },
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
