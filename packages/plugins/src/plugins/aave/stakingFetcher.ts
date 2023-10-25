import {
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import {
  aaveAddress,
  abptAddress,
  platformId,
  stkAaveAddress,
  stkAaveDecimals,
  stkAbptAddress,
  stkAbptDecimals,
} from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getBalances } from '../../utils/evm/getBalances';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const balances = await getBalances(
    owner as `0x${string}`,
    [stkAaveAddress, stkAbptAddress],
    NetworkId.ethereum
  );

  const elements: PortfolioElement[] = [];
  if (balances.at(0)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = new BigNumber(balances.at(0)!.toString())
      .div(10 ** stkAaveDecimals)
      .toNumber();
    const tokenPrice = await cache.getTokenPrice(
      aaveAddress,
      NetworkId.ethereum
    );
    const asset = tokenPriceToAssetToken(
      aaveAddress,
      amount,
      NetworkId.ethereum,
      tokenPrice
    );
    elements.push({
      networkId: NetworkId.ethereum,
      label: 'Staked',
      platformId,
      type: PortfolioElementType.multiple,
      value: asset.value,
      data: {
        assets: [asset],
      },
    });
  }

  if (balances.at(1)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = new BigNumber(balances.at(1)!.toString())
      .div(10 ** stkAbptDecimals)
      .toNumber();
    const tokenPrice = await cache.getTokenPrice(
      abptAddress,
      NetworkId.ethereum
    );
    const asset = tokenPriceToAssetToken(
      abptAddress,
      amount,
      NetworkId.ethereum,
      tokenPrice
    );
    elements.push({
      networkId: NetworkId.ethereum,
      label: 'Staked',
      platformId,
      type: PortfolioElementType.multiple,
      value: asset.value,
      data: {
        assets: [asset],
      },
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
