import {
  NetworkId,
  solanaNativeWrappedAddress,
} from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import {
  coinCreatorVaultAta,
  coinCreatorVaultAuthorityPda,
  creatorVaultPda,
} from './helpers';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { getClientSolana } from '../../utils/clients';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { tokenAccountStruct } from '../../utils/solana';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const ownerPk = new PublicKey(owner);
  const creatorVault = creatorVaultPda(ownerPk);
  const coinCreatorVaultAuthority = coinCreatorVaultAuthorityPda(ownerPk);
  const coinCreatorVault = coinCreatorVaultAta(
    coinCreatorVaultAuthority,
    new PublicKey(solanaNativeWrappedAddress)
  );
  const [creatorVaultAccount, coinCreatorVaultAccount] = await Promise.all([
    client.getAccountInfo(creatorVault),
    coinCreatorVault
      ? getParsedAccountInfo(client, tokenAccountStruct, coinCreatorVault)
      : undefined,
  ]);

  const registry = new ElementRegistry(NetworkId.solana, platformId);

  const element = registry.addElementMultiple({
    label: 'Rewards',
    link: `https://pump.fun/profile/${owner}?&tab=coins`,
  });

  if (creatorVaultAccount !== null) {
    const rentExemptionLamports =
      await client.getMinimumBalanceForRentExemption(
        creatorVaultAccount.data.length
      );

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
  }

  if (coinCreatorVaultAccount) {
    element.addAsset({
      address: solanaNativeWrappedAddress,
      amount: coinCreatorVaultAccount.amount,
      ref: coinCreatorVault,
      attributes: {
        isClaimable: true,
      },
    });
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-creator-rewards`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
