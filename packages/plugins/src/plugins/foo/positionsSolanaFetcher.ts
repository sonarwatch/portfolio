import { NetworkId, solanaNativeAddress } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { liquidityStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const accounts = await getParsedProgramAccounts(
    connection,
    liquidityStruct,
    new PublicKey('pid'),
    [
      {
        dataSize: liquidityStruct.byteSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 40,
        },
      },
    ]
  );
  if (accounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
  });

  accounts.forEach((acc) => {
    element.addAsset({
      address: solanaNativeAddress,
      amount: acc.amountDeposited,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions-solana`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
