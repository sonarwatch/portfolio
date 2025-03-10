import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId, programId, puffMint } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { userInfoStruct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    userInfoStruct,
    programId,
    [
      {
        memcmp: {
          bytes: owner,
          offset: 8,
        },
      },
      {
        memcmp: {
          bytes: 'EyK5FU8iAff',
          offset: 0,
        },
      },
      {
        dataSize: 112,
      },
    ]
  );
  if (accounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((acc) => {
    const element = elementRegistry.addElementMultiple({
      label: 'Staked',
      ref: acc.pubkey,
      link: 'https://staking.puffcoin.fun/',
    });

    element.addAsset({
      address: puffMint,
      amount: acc.amount.toNumber(),
    });
    element.addAsset({
      address: puffMint,
      amount: acc.claimableAmount.toNumber(),
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-staking`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
