import { PublicKey } from '@solana/web3.js';
import { NetworkIdType, TokenPriceSource } from '@sonarwatch/portfolio-core';
import { SolanaClient } from '../../clients/types';
import { walletTokensPlatform } from '../../../plugins/tokens/constants';
import { getParsedMultipleAccountsInfo } from '../getParsedMultipleAccountsInfo';
import { priceUpdateV2Struct } from './structs';

export async function getPythPricesAsMap(
  connection: SolanaClient,
  feedAddresses: PublicKey[]
): Promise<Map<string, number>> {
  const prices = await getPythPrices(connection, feedAddresses);
  const priceMap: Map<string, number> = new Map();
  feedAddresses.forEach((feedAddress, i) => {
    const price = prices[i];
    if (price) priceMap.set(feedAddress.toString(), price);
  });
  return priceMap;
}

export async function getPythPrices(
  connection: SolanaClient,
  feedAddresses: PublicKey[]
): Promise<(number | null)[]> {
  const accounts = await getParsedMultipleAccountsInfo(
    connection,
    priceUpdateV2Struct,
    feedAddresses
  );
  return accounts.map((acc) => {
    if (!acc) return null;
    if (Number(acc.priceMessage.publishTime) < Date.now() / 1000 - 3600)
      return null;
    return acc.priceMessage.price
      .times(10 ** acc.priceMessage.exponent)
      .toNumber();
  });
}

export async function getPythPrice(
  connection: SolanaClient,
  feedAddress: PublicKey
): Promise<number | null> {
  return (await getPythPrices(connection, [feedAddress]))[0];
}

export type FeedInfo = {
  address: PublicKey;
  tokens: {
    mint: string;
    decimals: number;
    networkdId: NetworkIdType;
    platformId?: string;
  }[];
};

export async function getPythTokenPriceSources(
  connection: SolanaClient,
  feedsInfo: FeedInfo[]
): Promise<(TokenPriceSource | null)[]> {
  const prices = await getPythPrices(
    connection,
    feedsInfo.map((feed) => feed.address)
  );

  return feedsInfo
    .map((feedInfo, i): TokenPriceSource[] | null => {
      const price = prices.at(i);
      if (price === null || price === undefined) return null;

      return feedInfo.tokens.map((token) => ({
        address: token.mint,
        id: `pyth-feed-${feedInfo.address.toString()}`,
        decimals: token.decimals,
        networkId: token.networkdId,
        platformId: token.platformId || walletTokensPlatform.id,
        price,
        timestamp: Date.now(),
        weight: 0.5,
      }));
    })
    .flat();
}
