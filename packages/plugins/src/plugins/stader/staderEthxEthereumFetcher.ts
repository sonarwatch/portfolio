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
import { Logger } from '../octav/utils/logger';

const DECIMALS_ON_CONTRACT = 18;
const NETWORK_ID = NetworkId.ethereum;

const logger = Logger.getLogger();

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const logCtx = { fn: 'staderEthxEthereumFetcher::executor', owner, networkId: NETWORK_ID, contractForBalances: ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET };

  logger.info(logCtx, 'Fetching stader ethx balances');

  const balances = await getBalances(
    owner,
    [ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET],
    NETWORK_ID
  );

  const elements: PortfolioElement[] = [];
  const rawBalance = balances.at(0)?.toString();
  logger.info({ ...logCtx, rawBalance }, 'Done fetching stader ethx balances');
  if (rawBalance) {
    const amount = new BigNumber(rawBalance).div(10 ** DECIMALS_ON_CONTRACT).toNumber();

    const tokenPrice = await cache.getTokenPrice(
      ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET,
      NETWORK_ID
    );

    logger.info({ ...logCtx, amount, tokenPrice }, 'Token price retrieved from cache');

    const stakedAsset = tokenPriceToAssetToken(
      ETHX_CONTRACT_ADDRESS_ETHREUM_MAINNET,
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
