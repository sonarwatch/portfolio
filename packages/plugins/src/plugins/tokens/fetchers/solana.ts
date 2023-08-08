import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElement,
  PortfolioElementMultiple,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletTokensPlatform } from '../../../platforms';
import { getClientSolana } from '../../../utils/clients';
import { getTokenAccountsByOwner } from '../../../utils/solana';
import tokenPriceToAssetTokens from '../../../utils/misc/tokenPriceToAssetTokens';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const ownerPubKey = new PublicKey(owner);

  const tokenAccounts = await getTokenAccountsByOwner(client, ownerPubKey);
  const mints = [...new Set(tokenAccounts.map((ta) => ta.mint.toString()))];

  const tokenPricesArray = await cache.getTokenPrices(mints, NetworkId.solana);
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPricesArray.forEach((tokenPrice) => {
    if (!tokenPrice) return;
    tokenPrices.set(tokenPrice.address, tokenPrice);
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
