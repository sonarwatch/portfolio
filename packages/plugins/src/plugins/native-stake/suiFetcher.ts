import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElement,
  suiNetwork,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  nativeStakePlatform,
  platformId,
  validatorsKey,
  validatorsPrefix,
} from './constants';
import { getClientSui } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { SuiValidatorInfo } from './types';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const stakedValidators = await client.getStakes({ owner });
  if (stakedValidators.length === 0) return [];

  const [suiTokenPrice, validatorsInfo] = await Promise.all([
    cache.getTokenPrice(suiNetwork.native.address, NetworkId.sui),
    cache.getItem<SuiValidatorInfo[]>(validatorsKey, {
      prefix: validatorsPrefix,
      networkId: NetworkId.sui,
    }),
  ]);
  if (!suiTokenPrice) return [];

  const elements: PortfolioElement[] = [];
  for (let i = 0; i < stakedValidators.length; i++) {
    const { stakes, validatorAddress } = stakedValidators[i];
    if (stakes.length === 0) continue;

    const validatorInfo = validatorsInfo?.find(
      (validator) => validator.address === validatorAddress
    );

    for (let j = 0; j < stakes.length; j++) {
      let value = 0;
      const assets: PortfolioAssetToken[] = [];
      const stakeInfo = stakes[j];

      if (
        stakeInfo.status === 'Active' &&
        !BigNumber(stakeInfo.estimatedReward).isZero()
      ) {
        const rewardAsset = tokenPriceToAssetToken(
          suiNetwork.native.address,
          new BigNumber(stakeInfo.estimatedReward)
            .div(10 ** suiNetwork.native.decimals)
            .toNumber(),
          NetworkId.sui,
          suiTokenPrice
        );
        assets.push(rewardAsset);
        value += rewardAsset.value !== null ? rewardAsset.value : 0;
      }

      const stakedAmount = new BigNumber(stakeInfo.principal)
        .div(10 ** suiNetwork.native.decimals)
        .toNumber();

      const stakedAsset = tokenPriceToAssetToken(
        suiNetwork.native.address,
        stakedAmount,
        NetworkId.sui,
        suiTokenPrice,
        undefined,
        {
          tags: [stakeInfo.status],
        }
      );
      assets.push({
        ...stakedAsset,
        imageUri: validatorInfo?.logoUrl,
        name: validatorInfo?.name,
      });

      value += stakedAsset.value !== null ? stakedAsset.value : 0;
      elements.push({
        networkId: NetworkId.sui,
        platformId: nativeStakePlatform.id,
        type: 'multiple',
        label: 'Staked',
        value,
        data: {
          assets,
        },
      });
    }
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-sui`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
