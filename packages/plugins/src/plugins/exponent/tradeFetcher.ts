import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { exponentCoreProgram, marketsMemo, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { yieldTokenStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    yieldTokenStruct,
    exponentCoreProgram,
    [
      { memcmp: { bytes: 'f2hAAfmp7TB', offset: 0 } },
      { memcmp: { bytes: owner, offset: 8 } },
    ]
  );

  if (accounts.length === 0) return [];

  const markets = await marketsMemo.getItem(cache);
  if (!markets) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const market = markets.find((m) => m.vault.id === account.vault.toString());
    if (!market) return;

    const maturity = new Date(
      (market.vault.start + market.vault.duration) * 1000
    );

    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      name: `${market.vault.platform} ${maturity.toLocaleString('en-US', {
        month: 'short',
      })} ${maturity.getDate()} ${maturity.getFullYear().toString()}`,
      link: 'https://www.exponent.finance/farm',
      ref: account.pubkey,
    });

    element.addAsset({
      address: market.vault.mintAsset,
      amount: account.yt_balance.multipliedBy(1 - market.stats.ptPriceInAsset),
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-trade`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
