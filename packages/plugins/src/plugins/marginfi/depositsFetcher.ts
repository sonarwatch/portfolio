import { NetworkId, PortfolioElement } from '@sonarwatch/portfolio-core';
import { MarginfiProgram, platformId, banksKey } from './constants';
import { marginfiAccountStruct } from './structs/MarginfiAccount';
import { getElementFromAccount } from './helpers';
import { accountsFilter } from './filters';
import { BankInfo } from './types';
import { ParsedAccount, getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    client,
    marginfiAccountStruct,
    MarginfiProgram,
    accountsFilter(owner)
  );
  if (accounts.length === 0) return [];

  const banksInfo = await cache.getItem<ParsedAccount<BankInfo>[]>(banksKey, {
    prefix: platformId,
    networkId: NetworkId.solana,
  });
  if (!banksInfo) throw new Error('Banks not cached');

  const banksInfoByAddress: Map<string, BankInfo> = new Map();
  const tokensAddresses: Set<string> = new Set();
  banksInfo.forEach((bankInfo) => {
    if (!bankInfo) return;
    banksInfoByAddress.set(bankInfo.pubkey.toString(), bankInfo as BankInfo);
    tokensAddresses.add(bankInfo.mint.toString());
  });

  const tokenPriceById = await cache.getTokenPricesAsMap(
    Array.from(tokensAddresses),
    NetworkId.solana
  );

  const elements: PortfolioElement[] = [];
  for (const account of accounts) {
    const element = getElementFromAccount(
      account,
      banksInfoByAddress,
      tokenPriceById
    );
    if (element) elements.push(element);
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
