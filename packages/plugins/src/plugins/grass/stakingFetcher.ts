import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { grassMint, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { userStakeInfoStruct } from './structs';
import { getStakePda } from './helpers';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const userStakeAccount = await getParsedAccountInfo(
    connection,
    userStakeInfoStruct,
    getStakePda(owner)
  );
  if (!userStakeAccount) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Staked',
    ref: userStakeAccount.pubkey.toString(),
    link: 'https://www.grassfoundation.io/stake',
  });

  userStakeAccount.unstake_requests.forEach((req) => {
    if (req.staking_pool_key.toString() !== solanaNativeAddress) {
      const lockedUntil = req.cooldown_end_time.times(1000).toNumber();
      element.addAsset({
        address: grassMint,
        amount: req.withdrawal_amount,
        attributes: {
          lockedUntil,
        },
      });
    }
  });

  element.addAsset({
    address: grassMint,
    amount: userStakeAccount.amount_staked,
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
