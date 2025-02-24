import {
  NetworkId,
  PortfolioAssetAttributes,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, zetaIdlItem, zexMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getStakeAccountsAddresses, getTimestamp } from './helpers';
import {
  getAutoParsedMultipleAccountsInfo,
  u8ArrayToString,
} from '../../utils/solana';
import { StakeAccount } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

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

  const registry = new ElementRegistry(networkId, platformId);
  const stakingElement = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://dex.zeta.markets/staking',
  });

  for (const account of accounts) {
    if (!account) continue;
    const name = u8ArrayToString(account.name);

    const amount = new BigNumber(account.amountStillStaked).toNumber();

    const attributes: PortfolioAssetAttributes = {
      lockedUntil: account.stakeState.vesting
        ? getTimestamp(
            account.stakeDurationEpochs,
            account.stakeState.vesting.stakeStartEpoch
          )
        : -1,
      tags: [name],
    };

    stakingElement.addAsset({
      address: zexMint,
      amount,
      attributes,
      ref: account.pubkey.toString(),
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId,
  executor,
};

export default fetcher;
