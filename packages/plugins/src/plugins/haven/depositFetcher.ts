import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getPositionAccounts } from './utils';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const accounts = await getPositionAccounts(owner);
  if (!accounts.length) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account, i) => {
    const element = elementRegistry.addElementBorrowlend({
      label: 'Leverage',
      ref: account.pubkey.toString(),
      link: `https://haven.trade/positions?pid=${
        i + 1
      }&pk=${account.pubkey.toString()}`,
    });

    element.addSuppliedAsset({
      address: account.state.supply.mint,
      amount: account.state.supply.amountUsed.baseUnit,
    });
    element.addBorrowedAsset({
      address: account.state.debt.mint,
      amount: account.state.debt.amountUsed.baseUnit,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
