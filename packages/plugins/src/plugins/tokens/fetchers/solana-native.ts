import { PublicKey } from '@metaplex-foundation/js';
import {
  Cache,
  Fetcher,
  FetcherExecutor,
  NetworkId,
  PortfolioElementMultiple,
  PortfolioElementType,
  solanaNetwork,
} from '@sonarwatch/portfolio-core';
import { walletTokensPlatform } from '../../../platforms';
import { getClientSolana } from '../../../utils/clients';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

const solFactor = 10 ** solanaNetwork.native.decimals;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const ownerPubKey = new PublicKey(owner);

  const amountLamports = await client.getBalance(ownerPubKey);
  if (amountLamports === 0) return [];

  const amount = amountLamports / solFactor;
  const solTokenPrice = await cache.getTokenPrice(
    solanaNetwork.native.address,
    NetworkId.solana
  );

  const asset = tokenPriceToAssetToken(
    solanaNetwork.native.address,
    amount,
    NetworkId.solana,
    solTokenPrice
  );
  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.solana,
    platformId: walletTokensPlatform.id,
    label: 'Wallet',
    value: asset.value,
    data: {
      assets: [asset],
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-solana-native`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
