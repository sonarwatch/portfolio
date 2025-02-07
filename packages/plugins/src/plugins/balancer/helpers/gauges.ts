import {
  EvmNetworkIdType,
  NetworkId,
  NetworkIdType,
  formatTokenAddress,
  zeroAddressEvm,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { getAddress } from 'viem';
import { getEvmClient } from '../../../utils/clients';
import { ethGaugeControllerAddress } from '../constants';
import { abi, liquidityGaugeAbi } from '../abi';
import { rangeBI } from '../../../utils/misc/rangeBI';
import { GaugesByPool } from '../types';

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

export async function getBalancerGaugesV2(
  gaugesUrl: string,
  networkId: NetworkIdType
): Promise<GaugesByPool> {
  if (networkId === NetworkId.ethereum) return getBalancerEthGaugesV2();
  return getBalancerChildGaugesV2(gaugesUrl);
}

async function getBalancerChildGaugesV2(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  gaugesUrl: string
): Promise<GaugesByPool> {
  // TODO
  return {};
}

async function getBalancerEthGaugesV2() {
  const client = getEvmClient(NetworkId.ethereum);
  const nGauges = await client.readContract({
    address: ethGaugeControllerAddress,
    abi,
    functionName: 'n_gauges',
  });

  const gaugesRes = await client.multicall({
    contracts: rangeBI(nGauges).map((i) => ({
      abi,
      address: ethGaugeControllerAddress,
      functionName: 'gauges',
      args: [i],
    })),
  });

  const lpTokensRes = await client.multicall({
    contracts: gaugesRes.map((g) => ({
      abi,
      address: g.result || zeroAddressEvm,
      functionName: 'lp_token',
    })),
  });

  const gaugesByPool: GaugesByPool = {};
  lpTokensRes.forEach((lpTokenRes, i) => {
    if (lpTokenRes.status === 'failure') return;
    const gaugeRes = gaugesRes[i];
    if (gaugeRes.status === 'failure') return;

    const lpAddress = formatTokenAddress(lpTokenRes.result, NetworkId.ethereum);
    const gaugeAddress = formatTokenAddress(
      gaugeRes.result,
      NetworkId.ethereum
    );

    if (lpAddress === zeroAddressEvm) return;
    if (!gaugesByPool[lpAddress]) {
      gaugesByPool[lpAddress] = [];
    }
    gaugesByPool[lpAddress].push(gaugeAddress);
  });
  return gaugesByPool;
}
