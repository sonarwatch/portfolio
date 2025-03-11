import { apyToApr, NetworkId } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { defiTunaProgram, platformId, poolsMemo } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { lendingStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    lendingStruct,
    defiTunaProgram,
    [
      {
        memcmp: {
          offset: 0,
          bytes: '92fFkBB3XNA',
        },
      },
      {
        memcmp: {
          offset: 11,
          bytes: owner,
        },
      },
      {
        dataSize: 155,
      },
    ]
  );

  if (accounts.length === 0) return [];

  const pools = await poolsMemo.getItem(cache);

  if (!pools) throw new Error('Pools not cached');

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementBorrowlend({
    label: 'Lending',
    link: 'https://defituna.com/lending',
  });

  accounts.forEach((account) => {
    const pool = pools.find(
      (p) => p.mint.toString() === account.poolMint.toString()
    );
    if (!pool) return;

    element.addSuppliedAsset({
      address: account.poolMint,
      amount: account.depositedShares
        .multipliedBy(pool.depositedFunds)
        .dividedBy(pool.depositedShares),
      ref: account.pubkey,
      sourceRefs: [{ name: 'Lending Market', address: pool.pubkey.toString() }],
    });

    element.addSuppliedYield([
      {
        apy: new BigNumber(pool.supplyApy).toNumber(),
        apr: apyToApr(new BigNumber(pool.supplyApy).toNumber()),
      },
    ]);
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-lending`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
