import {
  EvmNetworkIdType,
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';

import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, stakedCvxFXSAddress } from './constants';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import { getEvmClient } from '../../utils/clients';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const cvxFxsAddress = '0xefb4b26fc242478c9008274f9e81db89fa6adab9';
const fxsAddress = '0xfc00000000000000000000000000000000000002';

const abi = [
  {
    inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
    name: 'earned',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        internalType: 'struct StakedCvxFxs.EarnedData[]',
        name: 'claimable',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

function fetcher(networkId: EvmNetworkIdType): Fetcher {
  const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
    const client = getEvmClient(networkId);
    const stakedPositions = [
      {
        address: stakedCvxFXSAddress,
        abi: balanceOfErc20ABI,
        functionName: 'balanceOf',
        args: [owner],
      } as const,
      {
        address: stakedCvxFXSAddress,
        abi,
        functionName: 'earned',
        args: [owner],
      } as const,
    ];

    const multicallResponse = await client.multicall({
      contracts: stakedPositions,
    });

    const [stakedBalanceResponse, rewardsResponse] = multicallResponse;

    const rawStakedBalance = new BigNumber(
      (stakedBalanceResponse.result as bigint).toString()
    );
    const rawRewardBalance = new BigNumber(
      (
        rewardsResponse.result as { token: string; amount: bigint }
      ).amount.toString()
    );

    const decimals = 18;
    const stakedBalance = rawStakedBalance.div(10 ** decimals).toNumber();
    const rewardBalance = rawRewardBalance.div(10 ** decimals).toNumber();

    const stakedTokenPrice = await cache.getTokenPrice(
      cvxFxsAddress,
      NetworkId.fraxtal
    );
    const rewardTokenPrice = await cache.getTokenPrice(
      fxsAddress,
      NetworkId.fraxtal
    );

    const stakedAsset = tokenPriceToAssetToken(
      cvxFxsAddress,
      stakedBalance,
      NetworkId.fraxtal,
      stakedTokenPrice
    );

    const rewardAsset = tokenPriceToAssetToken(
      fxsAddress,
      rewardBalance,
      NetworkId.fraxtal,
      rewardTokenPrice
    );

    const element: PortfolioElement = {
      networkId: NetworkId.ethereum,
      label: 'Staked',
      platformId,
      type: PortfolioElementType.multiple,
      value: stakedAsset.value,
      data: {
        assets: [stakedAsset],
        rewardAssets: [rewardAsset],
        // DO I need rewards values?
      },
    };

    return [element];
  };

  return {
    id: `${platformId}-${networkId}`,
    networkId,
    executor,
  };
}

export default fetcher;
