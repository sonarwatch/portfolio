import { PublicKey } from '@solana/web3.js';
import { getClientSolana } from '../../utils/clients';
import { userStruct } from './structs';
import { lendyProgramId } from './constants';
import { Memoized } from '../../utils/misc/Memoized';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';

const textureUsersMemo: { [key: string]: Memoized<string | null> } = {};

export const getMemoizedUser = async (
  owner: string
): Promise<string | null> => {
  if (!textureUsersMemo[owner]) {
    textureUsersMemo[owner] = new Memoized<string | null>(async () =>
      getUser(owner)
    );
  }
  return textureUsersMemo[owner].getItem();
};

const getUser = async (owner: string): Promise<string | null> => {
  const userPk = PublicKey.findProgramAddressSync(
    [new PublicKey(owner).toBytes(), Buffer.from('MONEY_LENDER_USER')],
    new PublicKey(lendyProgramId)
  )[0];

  const connection = getClientSolana();
  const account = await getParsedAccountInfo(connection, userStruct, userPk);

  return account?.pubkey.toString() || null;
};
