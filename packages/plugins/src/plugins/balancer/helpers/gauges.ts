import { EvmNetworkIdType } from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { getAddress } from 'viem';
import { getEvmClient } from '../../../utils/clients';
import { liquidityGaugeAbi } from '../abi';

export async function getOwnerBalRewardsV2(
  networkId: EvmNetworkIdType,
  owner: string,
  gaugeAddress: string
): Promise<{
  address: string;
  balance: BigNumber;
}> {
  const client = getEvmClient(networkId);

  const balRewardsCalls = [
    {
      address: getAddress(gaugeAddress),
      abi: liquidityGaugeAbi,
      functionName: 'claimable_tokens',
      args: [getAddress(owner)],
    },
    {
      address: getAddress(gaugeAddress),
      abi: liquidityGaugeAbi,
      functionName: 'bal_token',
    },
  ];
  const balRewardsCall = (
    await client.multicall({
      contracts: balRewardsCalls,
    })
  ).map((result) => result.result);

  return {
    address: balRewardsCall[1] as string,
    balance: new BigNumber((balRewardsCall[0] as bigint).toString()),
  };
}

export async function getOwnerGaugeRewardsV2(
  networkId: EvmNetworkIdType,
  owner: string,
  gaugeAddress: string
): Promise<{ address: string; balance: BigNumber }[]> {
  const client = getEvmClient(networkId);

  const numRewardsTokens = Number(
    await client.readContract({
      address: getAddress(gaugeAddress),
      abi: liquidityGaugeAbi,
      functionName: 'reward_count',
    })
  );

  const rewardTokenCalls = Array.from(
    { length: numRewardsTokens },
    (_, index) => ({
      address: getAddress(gaugeAddress),
      abi: liquidityGaugeAbi,
      functionName: 'reward_tokens',
      args: [index],
    })
  );

  const rewardTokenAddresses = (
    await client.multicall({
      contracts: rewardTokenCalls,
    })
  ).map((result) => result.result);

  const rewardTokenBalanceCalls = rewardTokenAddresses.map(
    (rewardTokenAddress) => ({
      address: getAddress(gaugeAddress),
      abi: liquidityGaugeAbi,
      functionName: 'claimable_reward',
      args: [owner, rewardTokenAddress],
    })
  );

  return (
    await client.multicall({
      contracts: rewardTokenBalanceCalls,
    })
  ).map((result, index) => ({
    address: rewardTokenBalanceCalls[index].args[1] as string,
    balance: new BigNumber((result.result as bigint).toString()),
  }));
}
