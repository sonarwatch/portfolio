import { Transaction } from '@mysten/sui/transactions';
import { suiClockAddress } from '@sonarwatch/portfolio-core';
import { getClientSui } from '../../utils/clients';
import { serializeReturnValue } from '../mole/helpers';
import { clmmPackage } from './constants';

export const getAccruedFeeAndRewards = async (
  coinA: string,
  coinB: string,
  poolId: string,
  positionId: string,
  rewards: string[],
  owner: string
) => {
  const tx = new Transaction();

  rewards.forEach((reward) => {
    tx.moveCall({
      arguments: [
        tx.object(suiClockAddress),
        tx.object(poolId),
        tx.object(positionId),
      ],
      target: `${clmmPackage}::pool::get_accrued_rewards`,
      typeArguments: [coinA, coinB, reward],
    });
  });

  tx.moveCall({
    arguments: [
      tx.object(suiClockAddress),
      tx.object(poolId),
      tx.object(positionId),
    ],
    target: `${clmmPackage}::pool::get_accrued_fee`,
    typeArguments: [coinA, coinB],
  });

  const simulateRes = await getClientSui().devInspectTransactionBlock({
    transactionBlock: tx,
    sender: owner,
  });

  if (!simulateRes.results) return null;
  const { returnValues } = simulateRes.results[simulateRes.results.length - 1];
  if (!returnValues) return null;

  return {
    rewards: rewards.map((reward, i) => {
      if (!simulateRes.results) return null;
      const { returnValues: rewardReturnValues } = simulateRes.results[i];
      if (!rewardReturnValues) return null;
      return serializeReturnValue(rewardReturnValues[0]);
    }),
    fee: {
      coinA: serializeReturnValue(returnValues[0]),
      coinB: serializeReturnValue(returnValues[1]),
    },
  };
};
