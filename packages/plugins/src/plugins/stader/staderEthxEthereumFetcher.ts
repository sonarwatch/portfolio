import {
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET,
  platformId,
  ETHX_STAKING_POOL_ETHEREUM,
} from './constants';

import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getBalances } from '../../utils/evm/getBalances';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const networkId = NetworkId.ethereum;
  const balances = await getBalances(
    owner,
    [ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET],
    networkId
  );

  const elements: PortfolioElement[] = [];
  if (balances.at(0)) {
    const rawBalance = new BigNumber(balances.at(0)!.toString());

    const decimals = 18;
    const balance = rawBalance.div(10 ** decimals).toNumber();

    const tokenPrice = await cache.getTokenPrice(
      ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET,
      networkId
    );

    const stakedAsset = tokenPriceToAssetToken(
      ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET,
      balance,
      networkId,
      tokenPrice
    );

    const stakedElement: PortfolioElement = {
      networkId,
      label: 'Staked',
      platformId,
      type: PortfolioElementType.multiple,
      value: stakedAsset.value,
      data: {
        assets: [stakedAsset],
      },
    };
    elements.push(stakedElement);
  }

  return elements;
};

const fetcher: Fetcher = {
  id: ETHX_STAKING_POOL_ETHEREUM,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
