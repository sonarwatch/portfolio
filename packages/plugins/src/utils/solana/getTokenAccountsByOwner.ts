import { PublicKey } from '@solana/web3.js';
import { solanaToken2022PidPk, solanaTokenPidPk } from './constants';
import {
  TokenAccount,
  tokenAccountStruct,
  TokenAccountWithMetadata,
} from './structs';
import { ParsedAccount } from './types';
import { MemoryCache } from '../misc/MemoryCache';
import { SolanaClient } from '../clients/types';
import { getClientSolana } from '../clients';
import { getMetadataPubkey } from '../../plugins/metaplex/helpers';
import { getParsedMultipleAccountsInfo } from './getParsedMultipleAccountsInfo';
import { metadataAccountStruct } from '../../plugins/metaplex/structs';

export const getTokenAccountsByOwner = async (
  client: SolanaClient,
  owner: string
): Promise<ParsedAccount<TokenAccountWithMetadata>[]> => {
  const tokenAccounts = await Promise.all([
    client.getTokenAccountsByOwner(new PublicKey(owner), {
      programId: solanaTokenPidPk,
    }),
    client.getTokenAccountsByOwner(new PublicKey(owner), {
      programId: solanaToken2022PidPk,
    }),
  ]);

  const tokenAccountsInfo = [
    ...tokenAccounts[0].value,
    ...tokenAccounts[1].value,
  ]
    .map((x) => ({
      ...tokenAccountStruct.deserialize(x.account.data)[0],
      pubkey: x.pubkey,
      lamports: x.account.lamports,
      tokenProgram: x.account.owner,
    }))
    .filter((a) => !a.amount.isZero()) as ParsedAccount<TokenAccount>[];

  const metadataAccounts = await getParsedMultipleAccountsInfo(
    client,
    metadataAccountStruct,
    tokenAccountsInfo
      .filter((t) => t.amount.isEqualTo(1))
      .map((t) => getMetadataPubkey(t.mint))
  );

  return tokenAccountsInfo.map((t, i) => {
    const metadataAccount = metadataAccounts[i];
    if (!metadataAccount) return t;
    return {
      ...t,
      metadata: {
        name: metadataAccount.data.name.split('\x00')[0].trim(),
        symbol: metadataAccount.data.symbol.split('\x00')[0].trim(),
      },
    };
  });
};

const memoCollection = new MemoryCache<ParsedAccount<TokenAccount>[]>(
  (owner: string) => getTokenAccountsByOwner(getClientSolana(), owner)
);

export const getTokenAccountsByOwnerMemo = async (owner: string) =>
  memoCollection.getItem(owner);
