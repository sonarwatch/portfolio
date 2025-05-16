import {
  NetworkId,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { creatorVaultPda } from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getClientSolana } from '../../utils/clients';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const ownerPk = new PublicKey(owner);
  const creatorVault = creatorVaultPda(ownerPk);

  const creatorVaultAccount = await client.getAccountInfo(creatorVault);

  if (!creatorVaultAccount) return [];

  const rentExemptionLamports = await client.getMinimumBalanceForRentExemption(
    creatorVaultAccount.data.length
  );

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  const element = registry.addElementMultiple({
    label: 'Rewards',
    link: `https://pump.fun/profile/${owner}?&tab=coins`,
  });

  element.addAsset({
    address: solanaNativeWrappedAddress,
    amount: new BigNumber(creatorVaultAccount.lamports).minus(
      rentExemptionLamports
    ),
    ref: creatorVault,
    attributes: {
      isClaimable: true,
    },
  });

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-creator-rewards`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
