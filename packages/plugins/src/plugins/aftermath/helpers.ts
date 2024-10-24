import { suiClockAddress } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  Transaction,
  TransactionObjectArgument,
} from '@mysten/sui/transactions';
import {
  BurnerVault,
  CoinType,
  HarvestedRewards,
  StakingPosition,
} from './types';
import { SuiClient } from '../../utils/clients/types';
import { Event } from '../../utils/sui/types';

export const getHarvestRewards = async (
  client: SuiClient,
  sender: string,
  stakedPosition: StakingPosition,
  stakeCoinType: string,
  vault: BurnerVault
) => {
  const rewards = new Map<string, BigNumber>();

  const rewardCoinTypes = vault.type_names.filter(
    (coinType, i) => vault.rewards[i] !== '0' && i > 0
  );
  if (rewardCoinTypes.length === 0) return rewards;

  const transactionBlock = new Transaction();

  const harvestedRewardsEventMetadataId = transactionBlock.moveCall({
    target: `0xcd41fbc59af65b7c58fd2590d5e35efbf756d50e6da2bd0413917102be6e1fdf::staked_position::begin_harvest`,
    typeArguments: [stakeCoinType],
    arguments: [transactionBlock.object(vault.id.id)],
  });

  const harvestedCoins: Record<CoinType, TransactionObjectArgument[]> = {};
  for (const rewardCoinType of rewardCoinTypes) {
    const harvestedCoin = transactionBlock.moveCall({
      target: `0xcd41fbc59af65b7c58fd2590d5e35efbf756d50e6da2bd0413917102be6e1fdf::staked_position::harvest_rewards`,
      typeArguments: [stakeCoinType, rewardCoinType],
      arguments: [
        transactionBlock.object(stakedPosition.id.id),
        transactionBlock.object(vault.id.id),
        harvestedRewardsEventMetadataId,
        transactionBlock.object(suiClockAddress),
      ],
    });

    if (rewardCoinType in harvestedCoins) {
      harvestedCoins[rewardCoinType].push(harvestedCoin);
    } else {
      harvestedCoins[rewardCoinType] = [harvestedCoin];
    }
  }

  transactionBlock.moveCall({
    target: `0xcd41fbc59af65b7c58fd2590d5e35efbf756d50e6da2bd0413917102be6e1fdf::staked_position::end_harvest`,
    typeArguments: [],
    arguments: [harvestedRewardsEventMetadataId],
  });

  for (const [, harvestedCoinIds] of Object.entries(harvestedCoins)) {
    const coinToTransfer = harvestedCoinIds[0];

    if (harvestedCoinIds.length > 1)
      transactionBlock.mergeCoins(coinToTransfer, harvestedCoinIds.slice(1));

    transactionBlock.transferObjects([coinToTransfer], sender);
  }

  const dir = await client.devInspectTransactionBlock({
    sender,
    transactionBlock,
  });

  const event = dir.events.find(
    (e) =>
      e.type ===
      '0x4f0a1a923dd063757fd37e04a9c2cee8980008e94433c9075c390065f98e9e4b::events::HarvestedRewardsEvent'
  );

  if (!event || !event.parsedJson) return rewards;

  const parsedEvent = event as Event<HarvestedRewards>;
  if (!parsedEvent.parsedJson) return rewards;

  parsedEvent.parsedJson.reward_types.forEach((coinType, i) => {
    if (parsedEvent.parsedJson) {
      const balance = new BigNumber(parsedEvent.parsedJson.reward_amounts[i]);
      if (balance.isGreaterThan(0)) rewards.set(coinType, balance);
    }
  });

  return rewards;
};
