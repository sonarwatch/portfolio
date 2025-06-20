import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { marketsKey, pid, platformId, reservesPrefix } from './constants';
import { getElementsFromObligations } from './helpers';
import { MarketInfo, ReserveInfo, ReserveInfoExtended } from './types';
import { getParsedProgramAccounts, ParsedAccount } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { Obligation, obligationStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const obligationsRaw = await getParsedProgramAccounts(
    client,
    obligationStruct,
    pid,
    [
      {
        dataSize: 1300,
      },
      {
        memcmp: {
          offset: 42,
          bytes: owner,
        },
      },
    ]
  );

  if (!obligationsRaw.length) return [];

  const markets = await cache.getItem<MarketInfo[]>(marketsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!markets) throw new Error('Markets not cached.');

  const marketsByAddress: Map<string, MarketInfo> = new Map();
  markets.forEach((market) => {
    if (market) marketsByAddress.set(market.address.toString(), market);
  });

  const obligations: ParsedAccount<Obligation>[] = [];
  const reserveAddresses: Set<string> = new Set();
  obligationsRaw.forEach((obligation) => {
    if (!obligation) return;

    const market = marketsByAddress.get(obligation.lendingMarket.toString());
    if (!market) return;

    obligations.push(obligation);
    market.reserves.forEach((reserve) => {
      reserveAddresses.add(reserve.address);
    });
  });
  if (obligations.length === 0) return [];

  const reservesInfos = await cache.getItems<ReserveInfoExtended>(
    Array.from(reserveAddresses),
    {
      prefix: reservesPrefix,
      networkId: NetworkId.solana,
    }
  );
  if (!reservesInfos) throw new Error('Reserves not cached.');

  const reserveByAddress: Map<string, ReserveInfo> = new Map();
  reservesInfos.forEach((reserveInfo) => {
    if (!reserveInfo) return;

    reserveByAddress.set(reserveInfo.pubkey, reserveInfo);
  });

  return getElementsFromObligations(
    obligations,
    reserveByAddress,
    marketsByAddress,
    owner,
    cache
  );
};

const fetcher: Fetcher = {
  id: `${platformId}-obligations`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
