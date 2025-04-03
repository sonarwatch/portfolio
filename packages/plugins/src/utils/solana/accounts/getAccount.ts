import {
  Account,
  address,
  assertAccountExists,
  decodeAccount,
  fetchEncodedAccount,
} from '@solana/kit';
import { PublicKey } from '@solana/web3.js';
import { getClientSolanaKit } from '../../clients/getClientSolana';
import { CodecWithLayout } from './getStructCodecWithLayout';

export const getAccount = async <T extends object>(
  accountAddress: string | PublicKey,
  codec: CodecWithLayout<T>
): Promise<Account<T> | null> => {
  const rpc = getClientSolanaKit();

  const maybeEncodedAccount = await fetchEncodedAccount(
    rpc,
    address(accountAddress.toString())
  );

  try {
    assertAccountExists(maybeEncodedAccount);
    return decodeAccount(maybeEncodedAccount, codec);
  } catch (e) {
    return null;
  }
};
