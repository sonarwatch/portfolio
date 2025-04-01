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
  STAKING_POOL_MANAGER_ADDRESS_ETHREUM_MAINNET,
} from './constants';

import { Cache } from '../../Cache';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getBalances } from '../../utils/evm/getBalances';
import { verboseLog } from '../octav/utils/loggingUtils';

const DECIMALS_ON_CONTRACT = 18;
const NETWORK_ID = NetworkId.ethereum;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const logCtx = { fn: 'staderEthxEthereumFetcher::executor', owner, networkId: NETWORK_ID, contractForBalances: ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET };

  verboseLog({ ...logCtx, contractsToFetchBalanceFor }, 'Fetching stader ethx balances');

  const balances = await getBalances(
    owner,
    [ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET, STAKING_POOL_MANAGER_ADDRESS_ETHREUM_MAINNET],
    NETWORK_ID
  );

  verboseLog({ ...logCtx, balances }, 'Balances retrieved');
  const elements: PortfolioElement[] = [];
  const rawBalance0 = balances.at(0)?.toString();
  if (rawBalance0) {
    const contractAddress = ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET;
    const contractDecimals = DECIMALS_ON_CONTRACT;
    const amount = new BigNumber(rawBalance0).div(10 ** contractDecimals).toNumber();

    const tokenPrice = await cache.getTokenPrice(
      contractAddress,
      NETWORK_ID
    );

    verboseLog({ ...logCtx, contractAddress, amount, tokenPrice }, 'Token price retrieved from cache');

    const stakedAsset = tokenPriceToAssetToken(
      contractAddress,
      amount,
      NETWORK_ID,
      tokenPrice
    );

    const stakedElement: PortfolioElement = {
      networkId: NETWORK_ID,
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

  const rawBalance1 = balances.at(1)?.toString();
  if (rawBalance1) {
    const contractAddress = STAKING_POOL_MANAGER_ADDRESS_ETHREUM_MAINNET;
    const contractDecimals = DECIMALS_ON_CONTRACT;

    const amount = new BigNumber(rawBalance1).div(10 ** contractDecimals).toNumber();

    const tokenPrice = await cache.getTokenPrice(
      contractAddress,
      NETWORK_ID
    );

    verboseLog({ ...logCtx, amount, tokenPrice }, 'Token price retrieved from cache');

    const stakedAsset = tokenPriceToAssetToken(
      contractAddress,
      amount,
      NETWORK_ID,
      tokenPrice
    );

    const stakedElement: PortfolioElement = {
      networkId: NETWORK_ID,
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
