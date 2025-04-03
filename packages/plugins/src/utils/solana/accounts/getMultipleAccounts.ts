import {
  Account,
  address,
  assertAccountExists,
  decodeAccount,
  fetchEncodedAccounts,
} from '@solana/kit';
import { PublicKey } from '@solana/web3.js';
import { getClientSolanaKit } from '../../clients/getClientSolana';
import { CodecWithLayout } from './getStructCodecWithLayout';

export const getMultipleAccounts = async <T extends object>(
  accountAddresses: string[] | PublicKey[],
  codec: CodecWithLayout<T>
): Promise<(Account<T> | null)[]> => {
  const rpc = getClientSolanaKit();

  const maybeEncodedAccounts = await fetchEncodedAccounts(
    rpc,
    accountAddresses.map((accountAddress) => address(accountAddress.toString()))
  );

  return maybeEncodedAccounts.map((maybeEncodedAccount) => {
    try {
      assertAccountExists(maybeEncodedAccount);
      return decodeAccount(maybeEncodedAccount, codec);
    } catch (e) {
      return null;
    }
  });
};
