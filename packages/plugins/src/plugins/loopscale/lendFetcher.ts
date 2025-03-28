import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { Cache } from '../../Cache';
import { loopscaleProgramId, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import { strategyStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const strategys = await ParsedGpa.build(
    connection,
    strategyStruct,
    loopscaleProgramId
  )
    .addFilter('accountDiscriminator', [174, 110, 39, 119, 82, 106, 169, 102])
    .addFilter('lender', new PublicKey(owner))
    .run();

  if (!strategys.length) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  strategys.forEach((strategy) => {
    const amount =
      new BN(strategy.external_yield_amount.array.reverse()).toNumber() +
      new BN(strategy.current_deployed_amount.array.reverse()).toNumber() +
      new BN(strategy.token_balance.array.reverse()).toNumber();
    if (strategy.principal_mint === PublicKey.default) {
      return;
    }

    const element = elementRegistry.addElementBorrowlend({
      label: 'Lending',
      ref: strategy.pubkey,
      link: 'https://app.loopscale.com/lend',
    });
    element.addSuppliedAsset({
      address: strategy.principal_mint,
      amount,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-lend`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
