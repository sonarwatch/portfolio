import {
  NetworkId,
  PortfolioAsset,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { jupMint, platformId } from './constants';
import { escrowStruct } from './structs';
import { getClientSolana } from '../../utils/clients';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { getVotePda } from './helpers';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const escrowPubkey = getVotePda(owner);
  const escrowAccount = await getParsedAccountInfo(
    client,
    escrowStruct,
    escrowPubkey
  );

  if (!escrowAccount) return [];

  const jupTokenPrice = await cache.getTokenPrice(jupMint, NetworkId.solana);
  if (!jupTokenPrice) return [];
  const { decimals } = jupTokenPrice;

  if (escrowAccount.amount.isZero()) return [];

  const asset: PortfolioAsset = tokenPriceToAssetToken(
    jupMint,
    escrowAccount.amount.dividedBy(10 ** decimals).toNumber(),
    NetworkId.solana,
    jupTokenPrice
  );
  if (!escrowAccount.escrowStartedAt.isZero()) {
    const unlockingAt = new Date(
      escrowAccount.escrowEndsAt.times(1000).toNumber()
    );
    asset.attributes = { lockedUntil: unlockingAt.getTime() };
  }

  return [
    {
      type: PortfolioElementType.multiple,
      label: 'Deposit',
      networkId: NetworkId.solana,
      platformId,
      data: { assets: [asset] },
      value: asset.value,
    },
  ];
};

const fetcher: Fetcher = {
  id: `${platformId}-vote`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
