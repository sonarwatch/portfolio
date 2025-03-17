import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  marketNameByAddress,
  marketsInfoKey,
  platformId,
  programId,
} from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { sandglassAccountStruct } from './structs';
import { userAccountFilters } from './filters';
import { MarketInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    client,
    sandglassAccountStruct,
    programId,
    userAccountFilters(owner)
  );

  if (accounts.length === 0) return [];

  const marketsInfos = await cache.getItem<MarketInfo[]>(marketsInfoKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!marketsInfos) throw new Error('Markets info not cached.');

  const marketInfoById: Map<string, MarketInfo> = new Map();
  marketsInfos.forEach((marketInfo) =>
    marketInfoById.set(marketInfo.pubkey.toString(), marketInfo)
  );

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  for (const account of accounts) {
    const market = marketInfoById.get(account.marketAccount.toString());
    if (!market) continue;

    const marketName = marketNameByAddress.get(market.pubkey);
    const element = registry.addElementMultiple({
      label: 'Staked',
      name: marketName,
      ref: account.pubkey,
      link: 'https://sandglass.so/markets',
      sourceRefs: [{ name: 'Market', address: market.pubkey }],
    });
    const { stakePtAmount, stakeYtAmount, stakeLpAmount } = account.stakeInfo;
    element.addAsset({ address: market.ptMint, amount: stakePtAmount });
    element.addAsset({ address: market.ytMint, amount: stakeYtAmount });
    element.addAsset({ address: market.lpMint, amount: stakeLpAmount });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
