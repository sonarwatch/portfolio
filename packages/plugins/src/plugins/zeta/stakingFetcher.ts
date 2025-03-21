import {
  NetworkId,
  PortfolioAssetAttributes,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId, zexMint } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getStakeAccountsAddresses, getTimestamp } from './helpers';
import {
  getParsedMultipleAccountsInfo,
  u8ArrayToString,
} from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { stakeAccountStruct } from './structs';

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
    const stakeAccounts = await getParsedMultipleAccountsInfo(
      client,
      stakeAccountStruct,
      stakeAccountsAddresses
    );

    index += step;
    accounts.push(...stakeAccounts);
  } while (!accounts.some((acc) => !acc));

  if (!accounts.length) return [];

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
      lockedUntil:
        account.stakeState.__kind === 'Vesting'
          ? getTimestamp(
              account.stakeDurationEpochs,
              account.stakeState.stakeStartEpoch
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
