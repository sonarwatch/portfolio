import { PublicKey } from '@solana/web3.js';
import { getTokenMetadata } from '@solana/spl-token';
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
    client
      .getTokenAccountsByOwner(new PublicKey(owner), {
        programId: solanaTokenPidPk,
      })
      .then((res) => res.value.map((t) => ({ ...t, isToken2022: false }))),
    client
      .getTokenAccountsByOwner(new PublicKey(owner), {
        programId: solanaToken2022PidPk,
      })
      .then((res) => res.value.map((t) => ({ ...t, isToken2022: true }))),
  ]);

  const tokenAccountsInfo = [...tokenAccounts[0], ...tokenAccounts[1]]
    .map((x) => ({
      ...tokenAccountStruct.deserialize(x.account.data)[0],
      pubkey: x.pubkey,
      lamports: x.account.lamports,
      tokenProgram: x.account.owner,
      isToken2022: x.isToken2022,
    }))
    .filter((a) => !a.amount.isZero()) as ParsedAccount<
    TokenAccount & {
      isToken2022: boolean;
    }
  >[];

  const [metadataAccounts, token2022Accounts] = await Promise.all([
    getParsedMultipleAccountsInfo(
      client,
      metadataAccountStruct,
      tokenAccountsInfo
        .filter((t) => !t.isToken2022)
        .map((t) => getMetadataPubkey(t.mint))
    ),
    Promise.all(
      tokenAccountsInfo
        .filter((t) => t.isToken2022)
        .map((t) => getTokenMetadata(client, t.mint))
    ),
  ]);

  return tokenAccountsInfo.map((t) => {
    let metadata: {
      name?: string;
      symbol?: string;
    };
    if (t.isToken2022) {
      const metadataAccount = token2022Accounts.find(
        (a) => a && a.mint.toString() === t.mint.toString()
      );
      metadata = {
        name: metadataAccount?.name,
        symbol: metadataAccount?.symbol,
      };
    } else {
      const metadataAccount = metadataAccounts.find(
        (a) => a && a.mint.toString() === t.mint.toString()
      );

      metadata = {
        name: metadataAccount?.data.name.split('\x00')[0].trim(),
        symbol: metadataAccount?.data.symbol.split('\x00')[0].trim(),
      };
    }

    if (!metadata || !metadata.name || !metadata.symbol) return t;

    return {
      ...t,
      metadata: {
        name: metadata.name,
        symbol: metadata.symbol,
      },
    };
  });
};

const memoCollection = new MemoryCache<ParsedAccount<TokenAccount>[]>(
  (owner: string) => getTokenAccountsByOwner(getClientSolana(), owner)
);

export const getTokenAccountsByOwnerMemo = async (owner: string) =>
  memoCollection.getItem(owner);
