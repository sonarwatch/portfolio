import { PublicKey } from '@solana/web3.js';
import { Memoized } from '../misc/Memoized';
import { solanaToken2022PidPk, solanaTokenPidPk } from './constants';
import { TokenAccount, tokenAccountStruct } from './structs';
import { getClientSolana } from '../clients';
import { ParsedAccount } from './types';

const reqMemos: { [key: string]: Memoized<ParsedAccount<TokenAccount>[]> } = {};

export const getTokenAccountsByOwner = async (owner: string) => {
  if (!reqMemos[owner]) {
    const client = getClientSolana();

    reqMemos[owner] = new Memoized(async () => {
      const [tokenAccounts, token2022Accounts] = await Promise.all([
        client.getTokenAccountsByOwner(new PublicKey(owner), {
          programId: solanaTokenPidPk,
        }),
        client.getTokenAccountsByOwner(new PublicKey(owner), {
          programId: solanaToken2022PidPk,
        }),
      ]);

      return [...tokenAccounts.value, ...token2022Accounts.value].map((x) => ({
        ...tokenAccountStruct.deserialize(x.account.data)[0],
        pubkey: x.pubkey,
        lamports: x.account.lamports,
        tokenProgram: x.account.owner,
      })) as ParsedAccount<TokenAccount>[];
    });
  }

  return reqMemos[owner].getItem();
};
