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
  solanaNetwork,
} from '@sonarwatch/portfolio-core';
import { Connection } from '@solana/web3.js';
import runInBatch from 'packages/plugins/src/utils/misc/runInBatch';
import { walletTokensPlatform } from '../../../platforms';
import { getClientSolana } from '../../../utils/clients';
import {
  ParsedAccount,
  TokenAccount,
  getTokenAccountsByOwner,
} from '../../../utils/solana';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

const solFactor = 10 ** solanaNetwork.native.decimals;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const ownerPubKey = new PublicKey(owner);
  const balancePromise = getBalance(ownerPubKey, client, cache);

  const tokenAccounts = await getTokenAccountsByOwner(client, ownerPubKey);
  const mints = [...new Set(tokenAccounts.map((ta) => ta.mint.toString()))];

  const functionsToRun = mints.map(
    (mint) => () => cache.getTokenPrice(mint, NetworkId.solana)
  );
  const results = await runInBatch(functionsToRun);
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

  // Native sol
  const balanceAsset = await balancePromise;
  if (balanceAsset) assets.push(balanceAsset);

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

async function getBalance(
  owner: PublicKey,
  client: Connection,
  cache: Cache
): Promise<PortfolioAssetToken | null> {
  const pTokenPrice = cache.getTokenPrice(
    solanaNetwork.native.address,
    NetworkId.solana
  );
  const amountLamports = await client.getBalance(owner);
  if (amountLamports === 0) return null;

  const amount = amountLamports / solFactor;
  const solTokenPrice = await pTokenPrice;

  return tokenPriceToAssetToken(
    solanaNetwork.native.address,
    amount,
    NetworkId.solana,
    solTokenPrice
  );
}

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-solana`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
