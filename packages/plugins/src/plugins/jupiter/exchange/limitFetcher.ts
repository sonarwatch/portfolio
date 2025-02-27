import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../../Cache';
import { Fetcher, FetcherExecutor } from '../../../Fetcher';
import { getClientSolana } from '../../../utils/clients';
import { getParsedProgramAccounts } from '../../../utils/solana';
import { platformId, limitV1ProgramId, limitV2ProgramId } from './constants';
import { limitFilters } from './filters';
import { ElementRegistry } from '../../../utils/elementbuilder/ElementRegistry';
import { limitOrderStruct, limitOrderV2Struct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accountsRes = await Promise.all([
    // V1
    getParsedProgramAccounts(
      client,
      limitOrderStruct,
      limitV1ProgramId,
      limitFilters(owner)
    ),
    // V2
    getParsedProgramAccounts(
      client,
      limitOrderV2Struct,
      limitV2ProgramId,
      limitFilters(owner)
    ),
  ]);
  const v1Length = accountsRes[0].length;
  const accounts = accountsRes.flat();
  if (accounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];

    const isV1 = i <= v1Length - 1;

    const element = elementRegistry.addElementTrade({
      tags: isV1 ? ['deprecated'] : undefined,
      ref: account.pubkey.toString(),
      link: 'https://jup.ag/trigger/',
    });

    element.setTrade({
      inputAsset: {
        address: account.inputMint,
        amount: account.makingAmount,
      },
      outputAsset: {
        address: account.outputMint,
        amount: account.oriTakingAmount.minus(account.takingAmount),
      },
      initialInputAmount: account.oriMakingAmount,
      expectedOutputAmount: account.oriTakingAmount,
      withdrawnOutputAmount: 0,
    });
  }

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-limit`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
