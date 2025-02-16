import {
  NetworkId,
  PortfolioAssetAttributes,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { marketsCacheKey, platformId, programId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedProgramAccounts,
  ParsedAccount,
  u8ArrayToString,
} from '../../utils/solana';
import {
  MarketV2,
  OrderDirection,
  OrderStatus,
  userTradeV2Struct,
} from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { calculatePnL } from './helpers';

const marketsMemo = new MemoizedCache<ParsedAccount<MarketV2>[]>(
  marketsCacheKey,
  {
    prefix: platformId,
    networkId: NetworkId.solana,
  }
);

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    userTradeV2Struct,
    programId,
    [
      {
        memcmp: {
          bytes: 'S3hFCmKfRYh',
          offset: 0,
        },
      },
      {
        memcmp: {
          bytes: owner,
          offset: 9,
        },
      },
      {
        dataSize: 1064,
      },
    ]
  );
  if (accounts.length === 0) return [];

  const markets = await marketsMemo.getItem(cache);
  if (!markets) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((acc) => {
    acc.orders.forEach((order) => {
      if (order.status === OrderStatus.Init) return;

      const market = markets.find(
        (m) => m && m.market_id.toString() === order.market_id.toString()
      );

      if (!market) return;

      const element = elementRegistry.addElementMultiple({
        label: 'Deposit',
        ref: acc.pubkey,
        sourceRefs: [
          {
            name: 'Market',
            address: market.pubkey.toString(),
          },
        ],
        link: `https://app.triadfi.co/market/${market.market_id.toString()}`,
        name: `${u8ArrayToString(market.question)} ${
          OrderDirection[order.direction]
        }`,
      });

      const attributes: PortfolioAssetAttributes = {};

      element.addAsset({
        address: market.mint,
        amount: order.total_amount,
        attributes,
      });

      element.addAsset({
        address: market.mint,
        amount: calculatePnL(market, order),
        attributes: {
          tags: ['PnL'],
        },
      });
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-markets`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
