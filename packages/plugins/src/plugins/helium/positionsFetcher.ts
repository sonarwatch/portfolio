import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { platformId, stakeRegistryId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { Cache } from '../../Cache';
import { getTokenAccountsByOwner } from '../../utils/solana/getTokenAccountsByOwner';
import { getClientSolana } from '../../utils/clients';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { heliumPlatformId } from '../daos/constants';
import { getLockedUntil } from '../daos/helpers';
import { getParsedMultipleAccountsInfo } from '../../utils/solana';
import { positionDataStruct } from './structs';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const potentialTokens = (await getTokenAccountsByOwner(owner)).filter((x) =>
    x.amount.isEqualTo(1)
  );

  const positionsProgramAddress = potentialTokens.map(
    (address) =>
      PublicKey.findProgramAddressSync(
        [Buffer.from('position'), address.mint.toBuffer()],
        stakeRegistryId
      )[0]
  );

  const client = getClientSolana();

  const accounts = await getParsedMultipleAccountsInfo(
    client,
    positionDataStruct,
    positionsProgramAddress
  );

  if (!accounts.length) return [];

  const elementRegistry = new ElementRegistry(
    NetworkId.solana,
    heliumPlatformId
  );

  accounts.forEach((account) => {
    if (!account) return;

    const element = elementRegistry.addElementMultiple({
      label: 'Deposit',
      ref: account.pubkey,
      link: `https://heliumvote.com/hnt/positions/${account.pubkey}`,
      sourceRefs: [{ name: 'Vault', address: account.registrar.toString() }],
    });

    const lockedUntil = getLockedUntil(
      account.lockup.startTs,
      account.lockup.endTs,
      account.lockup.kind
    );

    element.addAsset({
      address: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux',
      amount: account.amountDepositedNative,
      attributes: {
        lockedUntil,
      },
    });
  });

  return elementRegistry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-positions`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
