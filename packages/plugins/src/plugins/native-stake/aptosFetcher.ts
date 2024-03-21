import {
  NetworkId,
  PortfolioElement,
  aptosNetwork,
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
import { getClientAptos } from '../../utils/clients';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientAptos();
  const activeValidators = await cache.getItem<string[]>(validatorsKey, {
    prefix: validatorsPrefix,
    networkId: NetworkId.aptos,
  });
  if (!activeValidators) return [];

  const aptosPrice = await cache.getTokenPrice(
    aptosNetwork.native.address,
    NetworkId.aptos
  );
  if (!aptosPrice) return [];

  const elements: PortfolioElement[] = [];

  for (let i = 0; i < activeValidators.length; i++) {
    const validatorAddress = activeValidators[i];
    const stakedValuesInValidator = (await client.view({
      payload: {
        function: '0x1::delegation_pool::get_stake',
        typeArguments: [],
        functionArguments: [validatorAddress, owner],
      },
    })) as string[];

    const amount = stakedValuesInValidator
      .filter((item) => item !== '0')
      .reduce(
        (sum, current) =>
          new BigNumber(current)
            .div(10 ** aptosNetwork.native.decimals)
            .plus(sum)
            .toNumber(),
        0
      );
    if (amount === 0) continue;
    const asset = tokenPriceToAssetToken(
      aptosPrice.address,
      amount,
      NetworkId.aptos,
      aptosPrice
    );
    elements.push({
      networkId: NetworkId.aptos,
      platformId: nativeStakePlatform.id,
      type: 'multiple',
      label: 'Staked',
      tags: ['Native Stake'],
      value: asset.value,
      data: {
        assets: [asset],
      },
    });
  }
  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-aptos`,
  networkId: NetworkId.aptos,
  executor,
};

export default fetcher;
