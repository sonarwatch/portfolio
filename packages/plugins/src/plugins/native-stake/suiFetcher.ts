import {
  NetworkId,
  PortfolioAssetToken,
  PortfolioElement,
  suiNetwork,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSui } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSui();
  const stakedValidators = await client.getStakes({ owner });
  if (stakedValidators.length === 0) return [];

  const suiTokenPrice = await cache.getTokenPrice(
    suiNetwork.native.address,
    NetworkId.sui
  );
  if (!suiTokenPrice) return [];

  const elements: PortfolioElement[] = [];
  for (let i = 0; i < stakedValidators.length; i++) {
    const { stakes, validatorAddress } = stakedValidators[i];
    if (stakes.length === 0) continue;

    const assets: PortfolioAssetToken[] = [];
    let value = 0;
    for (let j = 0; j < stakes.length; j++) {
      const stakeInfo = stakes[j];
      const stakedAmount = new BigNumber(stakeInfo.principal)
        .div(10 ** suiNetwork.native.decimals)
        .toNumber();
      const stakedAsset = tokenPriceToAssetToken(
        suiNetwork.native.address,
        stakedAmount,
        NetworkId.sui,
        suiTokenPrice
      );
      assets.push(stakedAsset);
      value += stakedAsset.value !== null ? stakedAsset.value : 0;
    }
    elements.push({
      networkId: NetworkId.sui,
      platformId,
      type: 'multiple',
      label: 'Staked',
      name: validatorAddress,
      value,
      data: {
        assets,
      },
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-sui`,
  networkId: NetworkId.sui,
  executor,
};

export default fetcher;
