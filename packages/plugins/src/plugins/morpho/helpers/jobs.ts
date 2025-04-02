import {
  EvmNetworkIdType,
  formatTokenAddress,
  networks,
} from '@sonarwatch/portfolio-core';
import { MorphoAssetAPI } from '../types';
import { platformId } from '../constants';

export function buildTokenPriceSources(
  tokens: MorphoAssetAPI[],
  networkId: EvmNetworkIdType
) {
  return tokens
    .filter((token) => !!token.priceUsd)
    .map((token) => ({
      address: formatTokenAddress(token.address, networkId),
      decimals: token.decimals,
      id: platformId,
      networkId,
      platformId,
      price: token.priceUsd!,
      timestamp: Date.now(),
      weight: 1,
    }));
}

export function buildTokenMetaDataItems(
  tokens: MorphoAssetAPI[],
  networkId: EvmNetworkIdType
) {
  const metaData = tokens.map((token) => ({
    chainId: networks[networkId].chainId,
    address: token.address,
    decimals: token.decimals,
    name: token.name,
    symbol: token.symbol,
    logoURI: token.logoURI,
    extensions: {},
  }));

  return metaData.map((token) => {
    const address = formatTokenAddress(token.address, networkId);
    return {
      key: address,
      value: {
        ...token,
        address,
      },
    };
  });
}
