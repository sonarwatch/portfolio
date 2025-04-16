import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { fafMint, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { tokenStakeStruct } from './structs';
import { getTokenStakePDA } from './helpers';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const thirtyDays = 30 * 24 * 60 * 60;

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const tokenStakeAccount = await getParsedAccountInfo(
    client,
    tokenStakeStruct,
    getTokenStakePDA(owner)
  );
  if (!tokenStakeAccount) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const stakeElement = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://beast.flash.trade/token',
    ref: tokenStakeAccount.pubkey.toString(),
  });

  stakeElement.addAsset({
    address: fafMint,
    amount: tokenStakeAccount.activeStakeAmount,
    attributes: {
      lockedUntil: -1,
    },
  });

  tokenStakeAccount.withdrawRequest.forEach((withdrawRequest) =>
    stakeElement.addAsset({
      address: fafMint,
      amount: withdrawRequest.pendingDeactivation,
      attributes: {
        lockedUntil: withdrawRequest.withdrawRequestTimestamp
          .plus(thirtyDays)
          .times(1000)
          .toNumber(),
      },
    })
  );

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-faf-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
