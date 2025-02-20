import {
  EvmNetworkIdType,
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';

import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  cvxFxsAddress,
  fxsAddress,
  platformId,
  stakedCvxFXSAddress,
} from './constants';
import { balanceOfErc20ABI } from '../../utils/evm/erc20Abi';
import { getEvmClient } from '../../utils/clients';
import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { stakedRewardsABI } from './abis';

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
        abi: stakedRewardsABI,
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
        rewardsResponse.result as { token: string; amount: bigint }[]
      )[0].amount.toString()
    );

    const decimals = 18;
    const stakedBalance = rawStakedBalance.div(10 ** decimals).toNumber();
    const rewardBalance = rawRewardBalance.div(10 ** decimals).toNumber();

    const stakedTokenPrice = await cache.getTokenPrice(
      cvxFxsAddress, // we get the price of the base token
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

    const stakedElement: PortfolioElement = {
      networkId: NetworkId.ethereum,
      label: 'Staked',
      platformId,
      type: PortfolioElementType.multiple,
      value: stakedAsset.value,
      data: {
        assets: [stakedAsset],
      },
    };
    const rewardElement: PortfolioElement = {
      networkId: NetworkId.ethereum,
      label: 'Rewards',
      platformId,
      type: PortfolioElementType.multiple,
      value: rewardAsset.value,
      data: {
        assets: [rewardAsset],
      },
    };

    return [stakedElement, rewardElement];
  };

  return {
    id: `${platformId}-${networkId}-staked`,
    networkId,
    executor,
  };
}

export default fetcher;
