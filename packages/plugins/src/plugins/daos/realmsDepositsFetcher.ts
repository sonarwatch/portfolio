import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts,
} from '../../utils/solana';
import { voteStruct, voterStruct } from './structs/realms';
import { voteFilters } from './filters';
import { getLockedUntil, getVoterPda } from './helpers';
import { RealmData, RegistrarInfo } from './types';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();
  const realmData = await cache.getItem<RealmData>('data', {
    prefix: platformId,
    networkId: NetworkId.solana,
  });

  if (!realmData) throw new Error('Realm data not cached');

  const splGovPrograms = realmData.govPrograms;
  const registrarById: Map<string, RegistrarInfo> = new Map();
  const mintsSet: Set<string> = new Set();

  const voterAccountsPubKeys: PublicKey[] = [];
  realmData.registrars.forEach((registrarInfo) => {
    voterAccountsPubKeys.push(
      getVoterPda(owner, registrarInfo.pubkey, registrarInfo.vsr)
    );
    mintsSet.add(registrarInfo.mint);
    registrarById.set(registrarInfo.pubkey, registrarInfo);
  });

  const getAccountSplGovPromises = [];
  if (splGovPrograms) {
    for (const program of splGovPrograms) {
      getAccountSplGovPromises.push(
        getParsedProgramAccounts(
          client,
          voteStruct,
          new PublicKey(program),
          voteFilters(owner)
        )
      );
    }
  }

  const [splGovAccounts, tempVoterAccounts] = await Promise.all([
    (await Promise.all(getAccountSplGovPromises)).flat(),
    getParsedMultipleAccountsInfo(client, voterStruct, voterAccountsPubKeys),
  ]);

  const voterAccounts = tempVoterAccounts;
  if (tempVoterAccounts.length === 0 && splGovAccounts.length === 0) return [];

  splGovAccounts.forEach((account) => mintsSet.add(account.mint.toString()));

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const depositElement = registry.addElementMultiple({
    label: 'Deposit',
    link: 'https://app.realms.today/realms',
  });
  for (const voteAccount of splGovAccounts.flat()) {
    if (voteAccount.amount.isZero()) continue;
    depositElement.addAsset({
      address: voteAccount.mint.toString(),
      amount: voteAccount.amount,
      ref: voteAccount.pubkey.toString(),
    });
  }

  for (const voterAccount of voterAccounts) {
    if (!voterAccount) continue;
    const registrar = registrarById.get(voterAccount.registrar.toString());
    if (!registrar) continue;

    const { mint } = registrar;
    for (const deposit of voterAccount.deposits) {
      if (!deposit.amountDepositedNative.isZero()) {
        const lockedUntil = getLockedUntil(
          deposit.lockup.startTs,
          deposit.lockup.endTs,
          deposit.lockup.kind
        );

        depositElement.addAsset({
          address: mint,
          amount: deposit.amountDepositedNative,
          ref: voterAccount.pubkey.toString(),
          attributes: {
            lockedUntil,
          },
          sourceRefs: [{ name: 'Vault', address: registrar.pubkey }],
        });
      }
    }
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
