import { PublicKey } from '@metaplex-foundation/js';
import {
  Cache,
  Fetcher,
  FetcherExecutor,
  NetworkId,
  PortfolioAssetToken,
  PortfolioElement,
  PortfolioElementMultiple,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { walletTokensPlatform } from '../../../platforms';
import { getClientSolana } from '../../../utils/clients';
import { getTokenAccountsByOwner } from '../../../utils/solana';
import runInBatch from '../../../utils/misc/runInBatch';
import tokenPriceToAssetTokens from '../../../utils/misc/tokenPriceToAssetTokens';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

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

  const walletTokensAssets: PortfolioAssetToken[] = [];
  const liquiditiesByPlatformId: Record<string, PortfolioLiquidity[]> = {};

  for (let i = 0; i < tokenAccounts.length; i++) {
    const tokenAccount = tokenAccounts[i];
    if (tokenAccount.amount.isZero()) continue;

    const address = tokenAccount.mint.toString();
    const tokenPrice = tokenPrices.get(address);
    if (!tokenPrice) continue;

    const amount = tokenAccount.amount
      .div(10 ** tokenPrice.decimals)
      .toNumber();

    if (tokenPrice.platformId !== walletTokensPlatform.id) {
      const assets = tokenPriceToAssetTokens(
        address,
        amount,
        NetworkId.solana,
        tokenPrice
      );
      const liquidity: PortfolioLiquidity = {
        assets,
        assetsValue: getUsdValueSum(assets.map((a) => a.value)),
        rewardAssets: [],
        rewardAssetsValue: 0,
        value: getUsdValueSum(assets.map((a) => a.value)),
        yields: [],
      };
      if (!liquiditiesByPlatformId[tokenPrice.platformId]) {
        liquiditiesByPlatformId[tokenPrice.platformId] = [];
      }
      liquiditiesByPlatformId[tokenPrice.platformId].push(liquidity);
    } else {
      walletTokensAssets.push(
        tokenPriceToAssetToken(address, amount, NetworkId.solana, tokenPrice)
      );
    }
  }
  const elements: PortfolioElement[] = [];
  if (walletTokensAssets.length > 0) {
    const walletTokensElement: PortfolioElementMultiple = {
      type: PortfolioElementType.multiple,
      networkId: NetworkId.solana,
      platformId: walletTokensPlatform.id,
      label: 'Wallet',
      value: getUsdValueSum(walletTokensAssets.map((a) => a.value)),
      data: {
        assets: walletTokensAssets,
      },
    };
    elements.push(walletTokensElement);
  }
  for (const [platformId, liquidities] of Object.entries(
    liquiditiesByPlatformId
  )) {
    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.solana,
      platformId,
      label: 'LiquidityPool',
      value: getUsdValueSum(liquidities.map((a) => a.value)),
      data: {
        liquidities,
      },
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${walletTokensPlatform.id}-solana`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
