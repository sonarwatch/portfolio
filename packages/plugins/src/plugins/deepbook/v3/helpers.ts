import { Transaction } from '@mysten/sui/transactions';
import BigNumber from 'bignumber.js';
import { BcsReader } from '@mysten/bcs';
import { SuiClient } from '../../../utils/clients/types';
import { PoolSummary } from '../types';
import { PACKAGE_ID } from './constants';

export const getDeepbookBalanceManagerIds = async (
  client: SuiClient,
  owner: string
) => {
  const tx = new Transaction();

  tx.moveCall({
    target: `0x624a80998bfca8118a794c71cccca771c351158eecd425661e07056f4ed94683::cetus_balance_manager::get_balance_managers_by_owner`,
    arguments: [
      tx.object(
        '0x5c1a039f97ed1cbd84d54b5d633bdffd681086acc38961b1d366c4ecf680d150'
      ),
      tx.pure.address(owner),
    ],
    typeArguments: [],
  });

  const simulateRes = await client.devInspectTransactionBlock({
    transactionBlock: tx,
    sender: owner,
  });

  return simulateRes.events
    .filter(
      (e) =>
        e.type ===
        '0x624a80998bfca8118a794c71cccca771c351158eecd425661e07056f4ed94683::cetus_balance_manager::GetCetusBalanceManagerList'
    )
    .map(
      (e) =>
        (e.parsedJson as { deepbook_balance_managers: string[] })
          .deepbook_balance_managers
    )
    .flat();
};

export const getLockedBalances = async (
  pools: PoolSummary[],
  client: SuiClient,
  owner: string,
  managerKey: string
) => {
  const simulateRess = await Promise.all(
    pools.map(async (pool) => {
      // https://github.com/MystenLabs/sui/blob/5bc14df0074eb549ff9e431aee69fc6ffb2052fc/sdk/deepbook-v3/src/transactions/deepbook.ts#L676
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::pool::locked_balance`,
        arguments: [tx.object(pool.poolId), tx.object(managerKey)],
        typeArguments: [pool.baseAsset, pool.quoteAsset],
      });
      return client.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: owner,
      });
    })
  );
  const lockedBalances: {
    base: BigNumber;
    quote: BigNumber;
    deep: BigNumber;
    poolId: string;
    baseAsset: string;
    quoteAsset: string;
  }[] = [];
  pools.forEach((pool, i) => {
    const simulateRes = simulateRess[i];
    if (!simulateRes || simulateRes.error || !simulateRes.results) return;
    const { returnValues } = simulateRes.results[0];
    if (!returnValues) return;
    lockedBalances.push({
      ...pool,
      base: new BigNumber(
        new BcsReader(Uint8Array.from(returnValues[0][0])).read64()
      ),
      quote: new BigNumber(
        new BcsReader(Uint8Array.from(returnValues[1][0])).read64()
      ),
      deep: new BigNumber(
        new BcsReader(Uint8Array.from(returnValues[2][0])).read64()
      ),
    });
  });
  return lockedBalances;
};
