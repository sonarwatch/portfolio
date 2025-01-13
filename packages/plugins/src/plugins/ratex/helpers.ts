import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import {
  getAutoParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { LP, Program, User, UserStats, YieldMarketWithOracle } from './types';
import { getClientSolana } from '../../utils/clients';
import idl from './idl.json';
import { getPool } from './getPool';
import { Cache } from '../../Cache';

export const getUserStatsByProgram = async (
  programs: Program[],
  owner: string
): Promise<Map<string, UserStats>> => {
  const connection = getClientSolana();

  const userStatsPdas = programs.map((program) => {
    const [userStatsPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('user_stats'), new PublicKey(owner).toBuffer()],
      new PublicKey(program.programId)
    );
    return userStatsPda;
  });

  const userStatss = await getAutoParsedMultipleAccountsInfo<UserStats>(
    connection,
    {
      programId: programs[0].programId,
      idl,
      idlType: 'anchor',
    } as IdlItem,
    userStatsPdas
  );

  const userStatsByProgram = new Map();
  programs.forEach((program, i) => {
    const userStats = userStatss[i];
    if (!userStats || userStats.numberOfSubAccountsCreated === 0) return;

    userStatsByProgram.set(program.programId, userStats);
  });

  return userStatsByProgram;
};

export const getUsersByProgram = async (
  programs: Program[],
  userStatsByProgram: Map<string, UserStats>,
  owner: string
): Promise<Map<string, ParsedAccount<User>[]>> => {
  const userss = await Promise.all(
    programs.map((program) => {
      const userStats = userStatsByProgram.get(program.programId);
      if (!userStats || userStats.numberOfSubAccountsCreated === 0) return null;
      const idlItem = {
        programId: program.programId,
        idl,
        idlType: 'anchor',
      } as IdlItem;

      return getUsers(owner, userStats.numberOfSubAccountsCreated, idlItem);
    })
  );

  const usersByProgram = new Map();
  programs.forEach((program, i) => {
    const users = userss[i];
    if (!users) return;

    usersByProgram.set(program.programId, users);
  });
  return usersByProgram;
};

export const getLpDatasByProgram = async (
  programs: Program[],
  userStatsByProgram: Map<string, UserStats>,
  owner: string
): Promise<Map<string, ParsedAccount<LP>[]>> => {
  const lpDatass = await Promise.all(
    programs.map((program) => {
      const userStats = userStatsByProgram.get(program.programId);
      if (!userStats || userStats.numberOfSubAccountsCreated === 0) return null;
      const idlItem = {
        programId: program.programId,
        idl,
        idlType: 'anchor',
      } as IdlItem;

      return getLpDatas(owner, userStats.numberOfSubAccountsCreated, idlItem);
    })
  );

  const lpDatasByProgram = new Map();
  programs.forEach((program, i) => {
    const lpDatas = lpDatass[i];
    if (!lpDatas) return;

    lpDatasByProgram.set(program.programId, lpDatas);
  });
  return lpDatasByProgram;
};

export const getPools = async (
  programs: Program[],
  lpDatasByProgram: Map<string, ParsedAccount<LP>[]>,
  cache: Cache
): Promise<Map<string, YieldMarketWithOracle>> => {
  const pools = new Map();
  await Promise.all(
    programs.map((program) => {
      const lpDatas = lpDatasByProgram.get(program.programId);
      if (!lpDatas) return null;
      const idlItem = {
        programId: program.programId,
        idl,
        idlType: 'anchor',
      } as IdlItem;

      return Promise.all(
        lpDatas.map(
          (lpData) =>
            lpData &&
            getPool(new PublicKey(lpData.ammPosition.ammpool), idlItem, cache)
        )
      ).then((lpDatasPools) => {
        lpDatasPools.forEach((p) => {
          if (p) {
            pools.set(p.pubkey.toString(), p);
          }
        });
      });
    })
  );
  return pools;
};

export const getUsers = (
  owner: string,
  numberOfSubAccountsCreated: number,
  idlItem: IdlItem
) => {
  const userPdas: PublicKey[] = [];
  for (
    let subaccountId = 0;
    subaccountId < numberOfSubAccountsCreated;
    subaccountId++
  ) {
    const [userPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('user'),
        new PublicKey(owner).toBuffer(),
        new BN(subaccountId).toArrayLike(Buffer, 'le', 2),
      ],
      new PublicKey(idlItem.programId)
    );
    userPdas.push(userPda);
  }
  const connection = getClientSolana();
  return getAutoParsedMultipleAccountsInfo<User>(connection, idlItem, userPdas);
};

export const getLpDatas = (
  owner: string,
  numberOfSubAccountsCreated: number,
  idlItem: IdlItem
) => {
  const lpPdas: PublicKey[] = [];
  for (
    let subaccountId = 0;
    subaccountId < numberOfSubAccountsCreated;
    subaccountId++
  ) {
    const [lpPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('lp'),
        new PublicKey(owner).toBuffer(),
        new BN(subaccountId).toArrayLike(Buffer, 'le', 2),
      ],
      new PublicKey(idlItem.programId)
    );
    lpPdas.push(lpPda);
  }
  const connection = getClientSolana();
  return getAutoParsedMultipleAccountsInfo<LP>(connection, idlItem, lpPdas);
};
