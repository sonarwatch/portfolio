import {
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
  PortfolioAsset,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { customEigenlayerTokenMapping, platformId } from '../constants';

import { getEvmClient } from '../../../utils/clients';

import { getAddress } from 'viem';
import { abi } from '../abi';
import tokenPriceToAssetToken from '../../../utils/misc/tokenPriceToAssetToken';

import { Position } from '../types';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';
import { getYieldPositions } from './yield';
import { getDepositPositions } from './deposit';
import { getWithdrawals } from './withdrawal';

const executor: FetcherExecutor = async (
  owner: string,
  cache: Cache
): Promise<PortfolioElement[]> => {
  const yieldPositions = await getYieldPositions(owner, cache);
  const depositPositions = await getDepositPositions(owner, cache);
  const withdrawals = await getWithdrawals(owner, cache);

  return [...yieldPositions, ...depositPositions, ...withdrawals];
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.ethereum,
  executor,
};

export default fetcher;
