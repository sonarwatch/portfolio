import { PublicKey } from '@solana/web3.js';
import { getClientSolana } from '../../utils/clients';
import { userStruct } from './structs';
import { lendyProgramId } from './constants';
import { getParsedAccountInfo } from '../../utils/solana/getParsedAccountInfo';
import { MemoryCache } from '../../utils/misc/MemoryCache';

const getUser = async (owner: string): Promise<string | null> => {
  const userPk = PublicKey.findProgramAddressSync(
    [new PublicKey(owner).toBytes(), Buffer.from('MONEY_LENDER_USER')],
    new PublicKey(lendyProgramId)
  )[0];

  const connection = getClientSolana();
  const account = await getParsedAccountInfo(connection, userStruct, userPk);

  return account?.pubkey.toString() || null;
};

const memoCollection = new MemoryCache<string | null>(getUser);

export const getMemoizedUser = async (owner: string) =>
  memoCollection.getItem(owner);
