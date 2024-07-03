import {
  TransactionBlock,
  TransactionObjectArgument,
} from '@mysten/sui.js/transactions';
import { suiClockAddress } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import {
  BurnerVault,
  CoinType,
  HarvestedRewards,
  StakingPosition,
} from './types';
import { SuiClient } from '../../utils/clients/types';
import { Event } from '../../utils/sui/types';

const getActiveRewardCoinTypes = (burnerVault: BurnerVault) => {
  return burnerVault.type_names.filter((coinType, i) => {
    // TODO comment on sait le rewardCoinType ?
    return i > 0;
    /* data.actualRewards.find(
      (actualRewards) =>
        Helpers.addLeadingZeroesToType(
          actualRewards.type
        ) ===
        Helpers.addLeadingZeroesToType("0x" + coinType)
    )?.balance ?? 0 */
  });
};

export const getHarvestRewards = async (
  client: SuiClient,
  sender: string,
  stakedPosition: StakingPosition,
  stakeCoinType: string,
  vault: BurnerVault
) => {
  const rewards = new Map<string, BigNumber>();

  const rewardCoinTypes = getActiveRewardCoinTypes(vault);

  if (rewardCoinTypes.length === 0) return rewards;

  const transactionBlock = new TransactionBlock();

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

  for (const [coinType, harvestedCoinIds] of Object.entries(harvestedCoins)) {
    const coinToTransfer = harvestedCoinIds[0];

    if (harvestedCoinIds.length > 1)
      transactionBlock.mergeCoins(coinToTransfer, harvestedCoinIds.slice(1));

    transactionBlock.transferObjects([coinToTransfer], sender);
  }

  const dir = await client.devInspectTransactionBlock({
    sender,
    transactionBlock,
  });

  // @ts-ignore
  const event: Event<HarvestedRewards> | undefined = dir.events.find(
    (e) =>
      e.type ===
      '0x4f0a1a923dd063757fd37e04a9c2cee8980008e94433c9075c390065f98e9e4b::events::HarvestedRewardsEvent'
  );

  if (!event || !event.parsedJson) return rewards;

  event.parsedJson.reward_types.forEach((coinType, i) => {
    if (event.parsedJson) {
      const balance = new BigNumber(event.parsedJson.reward_amounts[i]);
      if (balance.isGreaterThan(0)) rewards.set(coinType, balance);
    }
  });

  return rewards;
};
