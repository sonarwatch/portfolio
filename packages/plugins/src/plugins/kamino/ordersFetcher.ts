import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { limitOrderProgramId, platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { orderStruct, Status } from './structs/order';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    client,
    orderStruct,
    limitOrderProgramId,
    [
      {
        memcmp: {
          offset: 0,
          bytes: 'PXZJQQ2HEmx',
        },
      },
      {
        memcmp: {
          offset: 40,
          bytes: owner,
        },
      },
      {
        dataSize: 424,
      },
    ]
  );
  if (!accounts) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((account) => {
    const element = elementRegistry.addElementTrade({
      label: 'LimitOrder',
      ref: account.pubkey,
      link: `https://swap.kamino.finance/swap`,
    });

    if (account.status === Status.Active)
      element.setTrade({
        inputAsset: {
          address: account.inputMint,
          amount: account.remainingInputAmount,
        },
        outputAsset: {
          address: account.outputMint,
          amount: account.filledOutputAmount,
        },
        initialInputAmount: account.initialInputAmount,
        expectedOutputAmount: account.expectedOutputAmount,
        withdrawnOutputAmount: 0,
      });

    if (account.tipAmount.isPositive()) {
      const tipElement = elementRegistry.addElementMultiple({
        label: 'Rewards',
        name: 'Swap Tips',
        ref: account.pubkey,
        link: `https://swap.kamino.finance/swap`,
      });
      tipElement.addAsset({
        address: solanaNativeAddress,
        amount: account.tipAmount,
      });
    }
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-orders`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
