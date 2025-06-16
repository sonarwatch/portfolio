import { PublicKey } from '@solana/web3.js';
import { solanaToken2022PidPk, solanaTokenPidPk } from './constants';
import { TokenAccount, tokenAccountStruct } from './structs';
import { getClientSolana } from '../clients';
import { ParsedAccount } from './types';
import { MemoryCache } from '../misc/MemoryCache';

const getTokenAccountsByOwnerSync = async (owner: string) => {
  const client = getClientSolana();
  const tokenAccounts = await Promise.all([
    client.getTokenAccountsByOwner(new PublicKey(owner), {
      programId: solanaTokenPidPk,
    }),
    client.getTokenAccountsByOwner(new PublicKey(owner), {
      programId: solanaToken2022PidPk,
    }),
  ]);
  return [...tokenAccounts[0].value, ...tokenAccounts[1].value].map((x) => ({
    ...tokenAccountStruct.deserialize(x.account.data)[0],
    pubkey: x.pubkey,
    lamports: x.account.lamports,
    tokenProgram: x.account.owner,
  })) as ParsedAccount<TokenAccount>[];
};

const memoCollection = new MemoryCache<ParsedAccount<TokenAccount>[]>(
  getTokenAccountsByOwnerSync
);

export const getTokenAccountsByOwner = async (owner: string) =>
  memoCollection.getItem(owner);
