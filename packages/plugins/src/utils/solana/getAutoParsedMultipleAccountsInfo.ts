import {
  Commitment,
  Connection,
  GetMultipleAccountsConfig,
  PublicKey,
} from '@solana/web3.js';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import {
  checkIfAccountParser,
  ParserType,
  SolanaFMParser,
} from '@solanafm/explorer-kit';
import { getMultipleAccountsInfoSafe } from './getMultipleAccountsInfoSafe';
import { ParsedAccount } from './types';

export async function getAutoParsedMultipleAccountsInfo<T>(
  connection: Connection,
  idlItem: IdlItem,
  publicKeys: PublicKey[],
  commitmentOrConfig?: Commitment | GetMultipleAccountsConfig
): Promise<(ParsedAccount<T> | null)[]> {
  const parser = new SolanaFMParser(idlItem, idlItem.programId.toString());
  const eventParser = parser.createParser(ParserType.ACCOUNT);

  if (!eventParser || !checkIfAccountParser(eventParser)) return [];

  const accountsInfo = await getMultipleAccountsInfoSafe(
    connection,
    publicKeys,
    commitmentOrConfig
  );

  return accountsInfo.map((accountInfo, i) => {
    if (!accountInfo) return null;

    try {
      const parsedAccount = eventParser.parseAccount(
        accountInfo.data.toString('base64')
      );
      if (parsedAccount === null) return null;

      return {
        pubkey: publicKeys[i],
        lamports: accountInfo.lamports,
        ...(parsedAccount.data as T),
      };
    } catch (err) {
      return null;
    }
  });
}
