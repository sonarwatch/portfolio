import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { platformId, dcaProgramId } from './constants';
import { dcaStruct } from './structs';
import { DCAFilters } from './filters';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    dcaStruct,
    dcaProgramId,
    DCAFilters(owner)
  );
  if (accounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];

    const element = elementRegistry.addElementTrade({ label: 'DCA' });

    element.setTrade({
      inputAsset: {
        address: account.inputMint,
        amount: account.inDeposited.minus(account.inUsed),
      },
      outputAsset: {
        address: account.outputMint,
        amount: account.outReceived.minus(account.outWithdrawn),
      },
      initialInputAmount: account.inDeposited,
      withdrawnOutputAmount: account.outWithdrawn,
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-dca`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
