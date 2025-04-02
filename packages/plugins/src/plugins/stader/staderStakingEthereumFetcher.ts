import {
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import {
  CONTRACT_ADDRESS_ETHX_TOKEN_ETHEREUM_MAINNET,
  platformId,
} from './constants';

import { Cache } from '../../Cache';
import { getBalances } from '../../utils/evm/getBalances';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { verboseLog } from '../octav/utils/loggingUtils';

const DECIMALS_ON_CONTRACT = 18;
const NETWORK_ID = NetworkId.ethereum;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const contractsToFetchBalanceFor = [
    CONTRACT_ADDRESS_ETHX_TOKEN_ETHEREUM_MAINNET,
  ];
  const logCtx = {
    fn: 'staderStakingEthereumFetcher::executor',
    owner,
    networkId: NETWORK_ID,
  };

  verboseLog(
    { ...logCtx, contractsToFetchBalanceFor },
    'Fetching stader ethx balances'
  );

  const balances = await getBalances(
    owner,
    contractsToFetchBalanceFor,
    NETWORK_ID
  );

  verboseLog({ ...logCtx, balances }, 'Balances retrieved');

  const elements: PortfolioElement[] = [];
  const rawBalance0 = balances.at(0)?.toString();
  if (rawBalance0) {
    const contractAddress = contractsToFetchBalanceFor[0];
    const contractDecimals = DECIMALS_ON_CONTRACT;
    const amount = new BigNumber(rawBalance0)
      .div(10 ** contractDecimals)
      .toNumber();

    const tokenPrice = await cache.getTokenPrice(contractAddress, NETWORK_ID);

    verboseLog(
      { ...logCtx, contractAddress, amount, tokenPrice },
      'Token price retrieved from cache'
    );

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
  id: `${platformId}-${NetworkId.ethereum}-staking`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
