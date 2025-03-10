import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { pid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { depositStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getParsedProgramAccounts, usdcSolanaMint } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    depositStruct,
    pid,
    [
      {
        memcmp: {
          bytes: owner,
          offset: 40,
        },
      },
      {
        dataSize: 72,
      },
    ]
  );

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
    name: 'Thor V3',
    link: 'https://legacy.cyberfrogs.io/faction-contracts-v3',
  });

  accounts.forEach((deposit) => {
    element.addAsset({
      address: usdcSolanaMint,
      amount: deposit.depositInitial,
      attributes: {
        lockedUntil: deposit.endTs.times(1000).toNumber(),
      },
      ref: deposit.pubkey,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-thor-deposit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
