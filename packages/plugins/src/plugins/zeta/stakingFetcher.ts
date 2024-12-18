import {
  NetworkId,
  PortfolioAssetAttributes,
  PortfolioElement,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, zetaIdlItem, zexDecimals, zexMint } from './constants';
import tokenPriceToAssetToken from '../../utils/misc/tokenPriceToAssetToken';
import { getClientSolana } from '../../utils/clients';
import { getStakeAccountsAddresses, getTimestamp } from './helpers';
import {
  getAutoParsedMultipleAccountsInfo,
  u8ArrayToString,
} from '../../utils/solana';
import { StakeAccount } from './types';

const networkId = NetworkId.solana;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  let index = 0;
  const step = 5;
  const accounts = [];
  do {
    const stakeAccountsAddresses = getStakeAccountsAddresses(
      owner,
      index,
      index + step
    );
    const stakeAccounts = await getAutoParsedMultipleAccountsInfo<StakeAccount>(
      client,
      zetaIdlItem,
      stakeAccountsAddresses
    );

    index += step;
    accounts.push(...stakeAccounts);
  } while (!accounts.some((acc) => !acc));

  const tokenPrice = await cache.getTokenPrice(zexMint, networkId);

  const elements: PortfolioElement[] = [];
  for (const account of accounts) {
    if (!account) continue;
    const name = u8ArrayToString(account.name);

    const amount = new BigNumber(account.amountStillStaked)
      .dividedBy(10 ** zexDecimals)
      .toNumber();

    const attributes: PortfolioAssetAttributes = {
      lockedUntil: account.stakeState.vesting
        ? getTimestamp(
            account.stakeDurationEpochs,
            account.stakeState.vesting.stakeStartEpoch
          )
        : -1,
    };

    const asset = tokenPriceToAssetToken(
      zexMint,
      amount,
      networkId,
      tokenPrice,
      undefined,
      attributes
    );

    elements.push({
      type: 'multiple',
      label: 'Staked',
      networkId,
      platformId,
      name,
      data: {
        assets: [asset],
      },
      value: asset.value,
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId,
  executor,
};

export default fetcher;
