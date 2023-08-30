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
import { walletTokensPlatform } from '../constants';
import { getClientSolana } from '../../../utils/clients';
import { getTokenAccountsByOwner } from '../../../utils/solana';
import tokenPriceToAssetTokens from '../../../utils/misc/tokenPriceToAssetTokens';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

function getTag(platformId: string, elementName?: string) {
  return `${platformId}${elementName ? `<|>${elementName}` : ''}`;
}

function parseTag(tag: string): {
  platformId: string;
  elementName?: string;
} {
  const split = tag.split('<|>', 2);
  if (split.length < 1) throw new Error(`Tag is not valid: ${tag}`);
  return {
    platformId: split[0],
    elementName: split.at(1),
  };
}

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
  const liquiditiesByTag: Record<string, PortfolioLiquidity[]> = {};

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
      const tag = getTag(tokenPrice.platformId, tokenPrice.elementName);
      if (!liquiditiesByTag[tag]) {
        liquiditiesByTag[tag] = [];
      }
      liquiditiesByTag[tag].push(liquidity);
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
  for (const [tag, liquidities] of Object.entries(liquiditiesByTag)) {
    const { platformId, elementName } = parseTag(tag);
    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.solana,
      platformId,
      name: elementName,
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
