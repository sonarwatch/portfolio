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
  const promiseSolTokenPrice = cache.getTokenPrice(
    solanaNetwork.native.address,
    NetworkId.solana
  );
  const balanceAssetPromise = getBalance(
    ownerPubKey,
    client,
    promiseSolTokenPrice
  );
  const tokenAccounts = await getTokenAccountsByOwner(client, ownerPubKey);
  const unsolvedTokenAccounts: ParsedAccount<TokenAccount>[] = [];
  const assets: PortfolioAssetToken[] = [];

  for (let i = 0; i < tokenAccounts.length; i++) {
    const tokenAccount = tokenAccounts[i];
    if (tokenAccount.amount.isZero()) continue;
    const address = tokenAccount.mint.toString();
    const tokenPrice = await cache.getTokenPrice(address, NetworkId.solana);
    if (!tokenPrice) {
      unsolvedTokenAccounts.push(tokenAccount);
      continue;
    }

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
  const balanceAsset = await balanceAssetPromise;
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
  promiseSolTokenPrice: Promise<TokenPrice | undefined>
): Promise<PortfolioAssetToken | null> {
  const amountLamports = await client.getBalance(owner);
  if (amountLamports === 0) return null;

  const amount = amountLamports / solFactor;
  const solTokenPrice = await promiseSolTokenPrice;
  if (!promiseSolTokenPrice) return null;
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
