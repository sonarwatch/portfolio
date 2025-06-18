import { NetworkId } from '@sonarwatch/portfolio-core';
import { Cache } from '../../Cache';
import { bonkMint, daoPid, platformId } from './constants';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { getClientSolana } from '../../utils/clients';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { ElementRegistry } from '../../utils/elementbuilder/ElementRegistry';
import { MemoizedCache } from '../../utils/misc/MemoizedCache';
import { Registrar, voterStruct } from './structs';
import { registrarKey } from '../daos/constants';
import { getVoterPda } from '../daos/helpers';

const registrarMemo = new MemoizedCache<ParsedAccount<Registrar>[]>(
  registrarKey,
  { networkId: NetworkId.solana, prefix: platformId }
);
const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const client = getClientSolana();

  const registrar = await registrarMemo.getItem(cache);
  if (!registrar) {
    throw new Error('Registrar not cached');
  }

  const accounts = await getParsedMultipleAccountsInfo(
    client,
    voterStruct,
    registrar.map((r) =>
      getVoterPda(owner, r.pubkey.toString(), daoPid.toString())
    )
  );
  if (accounts.length === 0) return [];

  const registry = new ElementRegistry(NetworkId.solana, platformId);
  const depositElement = registry.addElementMultiple({
    label: 'Deposit',
    link: 'https://www.bonkdao.com/',
    name: 'DAO',
  });

  for (const account of accounts) {
    if (!account) continue;
    for (const deposit of account.deposits) {
      depositElement.addAsset({
        address: bonkMint,
        amount: deposit.amountDepositedNative,
        ref: account.pubkey.toString(),
        sourceRefs: [{ name: 'Vault', address: account.registrar.toString() }],
      });
    }
  }

  return registry.getElements(cache);
};

const fetcher: Fetcher = {
  id: `${platformId}-dao`,
  networkId: NetworkId.solana,
  executor,
};

export default fetcher;
