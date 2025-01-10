import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { exponentCoreProgram, marketsMemo, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedProgramAccounts } from '../../utils/solana';
import { getClientSolana } from '../../utils/clients';
import { lpPositionStruct } from './structs';
import { calculateWeightedAPY } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    lpPositionStruct,
    exponentCoreProgram,
    [
      { memcmp: { bytes: 'Jimf5pVB9RT', offset: 0 } }, //
      { memcmp: { bytes: owner, offset: 8 } },
    ]
  );

  if (accounts.length === 0) return [];

  const markets = await marketsMemo.getItem(cache);
  if (!markets) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const market = markets.find((m) => m.id === account.market.toString());
    if (!market) return;

    const element = elementRegistry.addElementLiquidity({
      label: 'Vault',
      name: `${market.vault.platform} ${market.vault.niceName}`,
    });

    const liquidity = element.addLiquidity();

    liquidity.addAsset({
      address: account.market,
      amount: account.lp_balance,
    });

    const apy = calculateWeightedAPY(market.stats);

    liquidity.addYield({
      apy,
      apr: apyToApr(apy),
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-liquidity`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
