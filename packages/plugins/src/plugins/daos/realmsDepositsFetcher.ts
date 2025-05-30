import { NetworkId } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { platformId } from './constants';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  getParsedProgramAccounts, ParsedAccount
} from '../../utils/solana';
import { voteStruct, voterStruct, Vote } from './structs/realms';
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

  const tempVoterAccounts = await getParsedMultipleAccountsInfo(
    client,
    voterStruct,
    voterAccountsPubKeys
  );

  const hasValidVoter = tempVoterAccounts.some(Boolean);

  let splGovAccounts: ParsedAccount<Vote>[] = [];
  // In a real-time portfolio context, we skip governance vote account fetching unless there are active voter accounts with deposits,
  // since governance votes themselves do not impact portfolio value.
  if (hasValidVoter) {
    const getAccountSplGovPromises = splGovPrograms.map((program) =>
      getParsedProgramAccounts(
        client,
        voteStruct,
        new PublicKey(program),
        voteFilters(owner)
      )
    );
    splGovAccounts = (await Promise.all(getAccountSplGovPromises)).flat();
  }

  if (!hasValidVoter && splGovAccounts.length === 0) return [];

  const voterAccounts = tempVoterAccounts;
  splGovAccounts.forEach((account) => mintsSet.add(account.mint.toString()));

  const realmsRegistry = new ElementRegistry(NetworkId.solana, platformId);
  const depositElement = realmsRegistry.addElementMultiple({
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

  const registries: ElementRegistry[] = [];

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

        if (registrar.platformId) {
          const platformRegistry = new ElementRegistry(
            NetworkId.solana,
            registrar.platformId
          );
          const platformDeposit = platformRegistry.addElementMultiple({
            label: 'Deposit',
            link: registrar.link,
          });

          platformDeposit.addAsset({
            address: mint,
            amount: deposit.amountDepositedNative,
            ref: voterAccount.pubkey.toString(),
            attributes: {
              lockedUntil,
            },
            sourceRefs: [{ name: 'Vault', address: registrar.pubkey }],
          });
          registries.push(platformRegistry);
        } else {
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
  }
  const elements = await Promise.all([
    ...registries.flatMap((registry) => registry.getElements(cache)),
    realmsRegistry.getElements(cache),
  ]);

  return elements.flat();
};

const fetcher: Fetcher = {
  id: `${platformId}-deposits`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
