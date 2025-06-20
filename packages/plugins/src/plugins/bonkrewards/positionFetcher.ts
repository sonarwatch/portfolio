import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { bonkMint, platformId, stakePid } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakeDepositReceiptStruct } from './structs';
import { stakeDepositReceiptFilter } from './filters';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    stakeDepositReceiptStruct,
    stakePid,
    stakeDepositReceiptFilter(owner)
  );
  if (accounts.length === 0) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const stakeElement = registry.addElementMultiple({
    label: 'Staked',
    link: 'https://bonkrewards.com/',
  });

  for (const account of accounts) {
    if (account.depositAmount.isZero()) continue;

    const lockedUntil =
      (account.depositTimestamp.toNumber() +
        account.lockupDuration.toNumber()) *
      1000;

    stakeElement.addAsset({
      address: bonkMint,
      amount: account.depositAmount,
      ref: account.pubkey,
      attributes: {
        lockedUntil,
      },
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
