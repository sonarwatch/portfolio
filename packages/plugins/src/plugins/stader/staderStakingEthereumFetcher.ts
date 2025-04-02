import {
  formatEvmAddress,
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

import { Address } from 'viem';
import { Cache } from '../../Cache';
import { getBalances } from '../../utils/evm/getBalances';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { LoggingContext, verboseLog } from '../octav/utils/loggingUtils';

const DECIMALS_ON_CONTRACT = 18;
const NETWORK_ID = NetworkId.ethereum;

const fetchStakedEthx = async (
  owner: Address,
  cache: Cache,
  logCtx: LoggingContext
): Promise<PortfolioElement | undefined> => {
  const contractsToFetchBalanceFor = [
    CONTRACT_ADDRESS_ETHX_TOKEN_ETHEREUM_MAINNET,
  ];

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

  const rawBalance0 = balances.at(0)?.toString();
  if (!rawBalance0) {
    return undefined;
  }

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

  return {
    networkId: NETWORK_ID,
    label: 'Staked',
    platformId,
    type: PortfolioElementType.multiple,
    value: stakedAsset.value,
    data: {
      assets: [stakedAsset],
    },
  };
};

const executor: FetcherExecutor = async (owner: string, cache: Cache): Promise<PortfolioElement[]> => {
  const ownerAddress: Address = formatEvmAddress(owner) as Address;
  const logCtx = {
    fn: 'staderStakingEthereumFetcher::executor',
    ownerAddress,
    networkId: NETWORK_ID,
  };

  const elements: PortfolioElement[] = [];

  const stakedEthx = await fetchStakedEthx(ownerAddress, cache, logCtx);
  if (stakedEthx) {
    elements.push(stakedEthx);
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-${NETWORK_ID}-staking`,
  networkId: NETWORK_ID,
  executor,
};

export default fetcher;
