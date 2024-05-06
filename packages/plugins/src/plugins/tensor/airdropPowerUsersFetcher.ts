import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, tnsrMint } from './constants';
import { findPowerUserAllocation } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const amount = findPowerUserAllocation(owner);
  if (!amount) return [];

  const tokenPrice = await cache.getTokenPrice(tnsrMint, NetworkId.solana);

  const asset = tokenPriceToAssetToken(
    tnsrMint,
    amount,
    NetworkId.solana,
    tokenPrice,
    undefined,
    { isClaimable: false }
  );

  return [
    {
      type: 'multiple',
      label: 'Airdrop',
      networkId: NetworkId.solana,
      platformId,
      name: 'Power User',
      data: {
        assets: [asset],
      },
      value: asset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-airdrop-power-users`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
