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
  if (!markets) throw new Error('Markets not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const market = markets.find((m) => m.id === account.market.toString());
    if (!market) return;

    const maturity = new Date(
      (market.vault.start + market.vault.duration) * 1000
    );

    const element = elementRegistry.addElementLiquidity({
      label: 'LiquidityPool',
      name: `${market.vault.platform} ${maturity.toLocaleString('en-US', {
        month: 'short',
      })} ${maturity.getDate()} ${maturity.getFullYear().toString()}`,
      link: 'https://www.exponent.finance/liquidity',
    });

    const liquidity = element.addLiquidity({
      sourceRefs: [
        {
          address: market.id.toString(),
          name: 'Pool',
        },
      ],
      ref: account.pubkey,
    });

    liquidity.addAsset({
      address: market.vault.mintSy,
      amount: account.lp_balance.multipliedBy(market.stats.syAmountPerLpShare),
    });

    liquidity.addAsset({
      address: market.vault.mintPt,
      amount: account.lp_balance.multipliedBy(market.stats.ptAmountPerLpShare),
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
