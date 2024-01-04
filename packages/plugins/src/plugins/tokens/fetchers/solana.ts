import {
  NetworkId,
  PortfolioAssetCollectible,
  PortfolioAssetToken,
  PortfolioElement,
  PortfolioElementType,
  PortfolioLiquidity,
  TokenPrice,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { walletNftsPlatform, walletTokensPlatform } from '../constants';
import { getRpcEndpoint } from '../../../utils/clients/constants';
import { Cache } from '../../../Cache';
import { getLpTag, parseLpTag } from '../helpers';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';
import tokenPriceToLiquidity from '../../../utils/misc/tokenPriceToLiquidity';
import { heliusAssetToAssetCollectible } from '../../../utils/solana/das/heliusAssetToAssetCollectible';
import { getAssetsByOwnerDas } from '../../../utils/solana/das/getAssetsByOwnerDas';
import { isHeliusFungibleAsset } from '../../../utils/solana/das/isHeliusFungibleAsset';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const rpcEndpoint = getRpcEndpoint(NetworkId.solana);
  const items = await getAssetsByOwnerDas(rpcEndpoint, owner);

  const fungibleAddresses = items.reduce((addresses: string[], curr) => {
    if (isHeliusFungibleAsset(curr)) addresses.push(curr.id);
    return addresses;
  }, []);

  const tokenPricesArray = await cache.getTokenPrices(
    fungibleAddresses,
    NetworkId.solana
  );
  const tokenPrices: Map<string, TokenPrice> = new Map();
  tokenPricesArray.forEach((tokenPrice) => {
    if (tokenPrice) tokenPrices.set(tokenPrice.address, tokenPrice);
  });

  const nftAssets: PortfolioAssetCollectible[] = [];
  const tokenAssets: PortfolioAssetToken[] = [];
  const liquiditiesByTag: Record<string, PortfolioLiquidity[]> = {};

  for (let i = 0; i < items.length; i++) {
    const asset = items[i];
    const isFungible = isHeliusFungibleAsset(asset);
    const tokenPrice = isFungible ? tokenPrices.get(asset.id) : undefined;

    const address = asset.id;
    const amount = asset.token_info
      ? BigNumber(asset.token_info.balance)
          .div(10 ** asset.token_info.decimals)
          .toNumber()
      : 1;

    // If it's an LP Token
    if (tokenPrice && tokenPrice.platformId !== walletTokensPlatform.id) {
      const liquidity = tokenPriceToLiquidity(
        asset.id,
        amount,
        NetworkId.solana,
        tokenPrice
      );
      const tag = getLpTag(tokenPrice.platformId, tokenPrice.elementName);
      if (!liquiditiesByTag[tag]) {
        liquiditiesByTag[tag] = [];
      }
      liquiditiesByTag[tag].push(liquidity);
    }
    // If it's a regular token
    else if (tokenPrice && tokenPrice.platformId === walletTokensPlatform.id) {
      tokenAssets.push(
        tokenPriceToAssetToken(address, amount, NetworkId.solana, tokenPrice)
      );
    }
    // If it's a NFT
    else {
      nftAssets.push(heliusAssetToAssetCollectible(asset));
    }
  }
  const elements: PortfolioElement[] = [];
  if (nftAssets.length !== 0) {
    elements.push({
      type: PortfolioElementType.multiple,
      networkId: NetworkId.solana,
      platformId: walletNftsPlatform.id,
      label: 'Wallet',
      value: null,
      data: {
        assets: nftAssets,
      },
    });
  }
  if (tokenAssets.length !== 0) {
    elements.push({
      type: PortfolioElementType.multiple,
      networkId: NetworkId.solana,
      platformId: walletTokensPlatform.id,
      label: 'Wallet',
      value: getUsdValueSum(tokenAssets.map((a) => a.value)),
      data: {
        assets: tokenAssets,
      },
    });
  }
  for (const [tag, liquidities] of Object.entries(liquiditiesByTag)) {
    const { platformId, elementName } = parseLpTag(tag);
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
