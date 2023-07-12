import { PublicKey } from '@metaplex-foundation/js';
import {
  Cache,
  Fetcher,
  FetcherExecutor,
  NetworkId,
  PortfolioAssetToken,
  PortfolioAssetType,
  PortfolioElementMultiple,
  PortfolioElementType,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { walletTokensPlatform } from '../../../platforms';
import { getClientSolana } from '../../../utils/clients';
import { getTokenAccountsByOwner } from '../../../utils/solana';
import runInBatch from '../../../utils/misc/runInBatch';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const ownerPubKey = new PublicKey(owner);

  const tokenAccounts = await getTokenAccountsByOwner(client, ownerPubKey);
  const mints = [...new Set(tokenAccounts.map((ta) => ta.mint.toString()))];

  const results = await runInBatch(
    mints.map((mint) => () => cache.getTokenPrice(mint, NetworkId.solana))
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  results.forEach((r) => {
    if (r.status === 'rejected') return;
    if (!r.value) return;
    tokenPrices.set(r.value.address, r.value);
  });

  const assets: PortfolioAssetToken[] = [];
  for (let i = 0; i < tokenAccounts.length; i++) {
    const tokenAccount = tokenAccounts[i];
    if (tokenAccount.amount.isZero()) continue;
    const address = tokenAccount.mint.toString();
    const tokenPrice = tokenPrices.get(address);
    if (!tokenPrice) continue;

    const amount = tokenAccount.amount
      .div(10 ** tokenPrice.decimals)
      .toNumber();
    const { price } = tokenPrice;
    const value = price * amount;
    assets.push({
      type: PortfolioAssetType.token,
      networkId: NetworkId.solana,
      value,
      data: { address, amount, price },
    });
  }

  if (assets.length === 0) return [];
  const element: PortfolioElementMultiple = {
    type: PortfolioElementType.multiple,
    networkId: NetworkId.solana,
    platformId: walletTokensPlatform.id,
    label: 'Wallet',
    value: getUsdValueSum(assets.map((a) => a.value)),
    data: {
      assets,
    },
  };
  return [element];
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-solana`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
