import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { fragmetricPid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { userFundAccountStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();
  const userFundAccounts = await getParsedProgramAccounts(
    connection,
    userFundAccountStruct,
    fragmetricPid,
    [
      {
        dataSize: userFundAccountStruct.byteSize,
      },
      {
        memcmp: {
          bytes: owner,
          offset: 43,
        },
      },
    ]
  );

  if (userFundAccounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const element = elementRegistry.addElementMultiple({
    label: 'Deposit',
  });

  userFundAccounts.forEach((acc) => {
    element.addAsset({
      address: acc.receipt_token_mint,
      amount: acc.receipt_token_amount,
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
