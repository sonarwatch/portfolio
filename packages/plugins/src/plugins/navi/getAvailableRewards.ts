import { Transaction } from '@mysten/sui/transactions';
import { BCS, getSuiMoveConfig } from '@mysten/bcs';
import BigNumber from 'bignumber.js';
import { suiClockAddress } from '@sonarwatch/portfolio-core';
import { SuiClient } from '../../utils/clients/types';
import {
  incentiveFunction,
  incentiveObjectId,
  incentiveStorageObjectId,
  rateFactor,
  rewardsFunds,
} from './constants';
import { Pool } from './types';

const bcs = new BCS(getSuiMoveConfig());

bcs.registerStructType('IncentivePoolInfo', {
  pool_id: 'address',
  funds: 'address',
  phase: 'u64',
  start_at: 'u64',
  end_at: 'u64',
  closed_at: 'u64',
  total_supply: 'u64',
  asset_id: 'u8',
  option: 'u8',
  factor: 'u256',
  distributed: 'u64',
  available: 'u256',
  total: 'u256',
});

bcs.registerStructType('IncentivePoolInfoByPhase', {
  phase: 'u64',
  pools: 'vector<IncentivePoolInfo>',
});

function getTransactionBlock(owner: string, optionType: number) {
  const tx = new Transaction();

  tx.moveCall({
    target: incentiveFunction,
    arguments: [
      tx.object(suiClockAddress),
      tx.object(incentiveObjectId),
      tx.object(incentiveStorageObjectId),
      tx.pure.u64(0),
      tx.pure.u64(optionType),
      tx.pure.address(owner),
    ],
  });

  return tx;
}

async function getRewardPoolsData(
  client: SuiClient,
  tx: Transaction,
  owner: string
): Promise<{ phase: string; pools: Pool[] }[]> {
  try {
    const rewardsPoolsInfos = await client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: owner,
    });

    if (
      rewardsPoolsInfos.results &&
      rewardsPoolsInfos.results[0].returnValues
    ) {
      const o = rewardsPoolsInfos.results[0].returnValues;

      return o
        .map((e) =>
          bcs.de('vector<IncentivePoolInfoByPhase>', Uint8Array.from(e[0]))
        )
        .flat()
        .sort((e, n) => Number(n.phase) - Number(e.phase));
    }
  } catch (e) {
    //
  }

  return [];
}

export async function getAvailableRewards(
  client: SuiClient,
  owner: string
): Promise<Map<string, number>> {
  const rewards: Map<string, number> = new Map();

  const [supplyRewardPoolsData, borrowRewardPoolsData] = await Promise.all([
    getRewardPoolsData(client, getTransactionBlock(owner, 1), owner),
    getRewardPoolsData(client, getTransactionBlock(owner, 3), owner),
  ]);

  const browseRewardPoolData = (e: { pools: Pool[] }) => {
    e.pools.forEach((pool) => {
      const funds = pool.funds as keyof typeof rewardsFunds;
      const { coinType } = rewardsFunds[funds];
      const aggAmount = rewards.get(coinType) || 0;
      rewards.set(
        coinType,
        aggAmount +
          new BigNumber(pool.available).shiftedBy(-1 * rateFactor).toNumber()
      );
    });
  };

  supplyRewardPoolsData.forEach(browseRewardPoolData);
  borrowRewardPoolsData.forEach(browseRewardPoolData);

  return rewards;
}
