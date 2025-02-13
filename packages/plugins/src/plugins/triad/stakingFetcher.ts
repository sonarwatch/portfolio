import {
  NetworkId,
  PortfolioAssetAttributes,
} from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { platformId, programId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import { getParsedProgramAccounts } from '../../utils/solana';
import { stakeV2Struct } from './structs';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const connection = getClientSolana();

  const accounts = await getParsedProgramAccounts(
    connection,
    stakeV2Struct,
    programId,
    [
      {
        memcmp: {
          bytes: 'bgtkjcD34Si',
          offset: 0,
        },
      },
      {
        memcmp: {
          bytes: owner,
          offset: 9,
        },
      },
      {
        dataSize: 184,
      },
    ]
  );
  if (accounts.length === 0) return [];

  const elementRegistry = new ElementRegistry(NetworkId.solana, platformId);

  accounts.forEach((acc) => {
    const element = elementRegistry.addElementMultiple({
      label: 'Staked',
      ref: acc.pubkey,
      sourceRefs: [
        {
          name: 'Vault',
          address: acc.stake_vault.toString(),
        },
      ],
      link: 'https://app.triadfi.co/staking',
    });

    const attributes: PortfolioAssetAttributes = {};
    if (acc.withdraw_ts.isGreaterThan(0)) {
      attributes.lockedUntil = new Date(
        acc.withdraw_ts.times(1000).toNumber()
      ).getTime();
    }

    element.addAsset({
      address: acc.mint,
      amount: acc.available.toNumber(),
      attributes,
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
