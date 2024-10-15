import { NetworkId } from '@sonarwatch/portfolio-core';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { marketsKey, pid, platformId, reservesPrefix } from './constants';
import { getElementsFromObligations, getObligationSeed } from './helpers';
import { MarketInfo, ReserveInfo, ReserveInfoExtended } from './types';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { Obligation, obligationStruct } from './structs';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const obligationAddresses: PublicKey[] = [];

  const markets = await cache.getItem<MarketInfo[]>(marketsKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!markets) return [];

  const marketsByAddress: Map<string, MarketInfo> = new Map();
  markets.forEach((market) => {
    if (market) marketsByAddress.set(market.address.toString(), market);
  });

  for (const marketInfo of marketsByAddress.values()) {
    if (!marketInfo) continue;
    const seeds = [
      getObligationSeed(marketInfo.address, 0),
      getObligationSeed(marketInfo.address, 1),
      getObligationSeed(marketInfo.address, 2),
    ];
    for (let i = 0; i < seeds.length; i += 1) {
      const seed = seeds[i];
      const obligationAddress = await PublicKey.createWithSeed(
        new PublicKey(owner),
        seed,
        pid
      );
      obligationAddresses.push(obligationAddress);
    }
  }

  const obligationsRaw = await getParsedMultipleAccountsInfo(
    client,
    obligationStruct,
    obligationAddresses
  );
  if (obligationsRaw.length === 0) return [];

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
  if (!reservesInfos) return [];

  const reserveByAddress: Map<string, ReserveInfo> = new Map();
  const mints: Set<string> = new Set();
  const pythAddresses: PublicKey[] = [];
  reservesInfos.forEach((reserveInfo) => {
    if (!reserveInfo) return;

    mints.add(reserveInfo.reserve.liquidity.mintPubkey);
    reserveByAddress.set(reserveInfo.pubkey, reserveInfo);
    pythAddresses.push(new PublicKey(reserveInfo.reserve.liquidity.pythOracle));
  });

  const tokenPriceByAddress = await cache.getTokenPricesAsMap(
    Array.from(mints),
    NetworkId.solana
  );

  const pythAccounts = await getMultipleAccountsInfoSafe(client, pythAddresses);
  const pythAccByAddress: Map<string, AccountInfo<Buffer>> = new Map();
  for (let i = 0; i < pythAddresses.length; i++) {
    const account = pythAccounts[i];
    if (account === null) continue;

    pythAccByAddress.set(pythAddresses[i].toString(), account);
  }

  return getElementsFromObligations(
    obligations,
    reserveByAddress,
    marketsByAddress,
    tokenPriceByAddress,
    pythAccByAddress
  );
};

const fetcher: Fetcher = {
  id: `${platformId}-obligations`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
