import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import {
  getParsedMultipleAccountsInfo,
  ParsedAccount,
} from '../../utils/solana';
import { Program, YieldMarketWithOracle } from './types';
import { getClientSolana } from '../../utils/clients';
import { getPool } from './getPool';
import { Cache } from '../../Cache';
import {
  LP,
  lpStruct,
  LPV2,
  lpV2Struct,
  User,
  UserStats,
  userStatsStruct,
  userStruct,
} from './structs';
import { getMultipleAccountsInfoSafe } from '../../utils/solana/getMultipleAccountsInfoSafe';

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

  const userStatss = await getParsedMultipleAccountsInfo(
    connection,
    userStatsStruct,
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
      return getUsers(
        owner,
        userStats.numberOfSubAccountsCreated,
        new PublicKey(program.programId)
      );
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
): Promise<Map<string, ParsedAccount<LP | LPV2>[]>> => {
  const lpDatass = await Promise.all(
    programs.map((program) => {
      const userStats = userStatsByProgram.get(program.programId);
      if (!userStats || userStats.numberOfSubAccountsCreated === 0) return null;
      return getLpDatas(owner, userStats.numberOfSubAccountsCreated, program);
    })
  );

  const lpDatasByProgram = new Map();
  programs.forEach((program, i) => {
    const lpDatas = (lpDatass[i] || []).filter((n) => n !== null);
    if (!lpDatas) return;

    lpDatasByProgram.set(program.programId, lpDatas);
  });
  return lpDatasByProgram;
};

export const getPools = async (
  programs: Program[],
  lpDatasByProgram: Map<string, ParsedAccount<LP | LPV2>[]>,
  cache: Cache
): Promise<Map<string, YieldMarketWithOracle>> => {
  const pools = new Map();
  await Promise.all(
    programs.map((program) => {
      const lpDatas = lpDatasByProgram.get(program.programId);
      if (!lpDatas) return null;

      return Promise.all(
        lpDatas.map((lpData) => {
          const ammPoolAddress =
            'ammPosition' in lpData
              ? lpData.ammPosition.ammpool
              : lpData.ammpool;
          return getPool(new PublicKey(ammPoolAddress), cache);
        })
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

export const getUsers = async (
  owner: string,
  numberOfSubAccountsCreated: number,
  program: PublicKey
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
      program
    );
    userPdas.push(userPda);
  }
  const connection = getClientSolana();

  const accounts = await getMultipleAccountsInfoSafe(connection, userPdas);
  return accounts.flatMap((acc) => {
    if (!acc) return [];
    let parsedData;
    try {
      [parsedData] = userStruct.deserialize(acc.data);
    } catch (err) {
      return [];
    }
    return parsedData;
  });
};

export const getLpDatas = async (
  owner: string,
  numberOfSubAccountsCreated: number,
  program: Program
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
      new PublicKey(program.programId)
    );
    lpPdas.push(lpPda);
  }

  return program.version === 1
    ? getParsedMultipleAccountsInfo(getClientSolana(), lpStruct, lpPdas)
    : getParsedMultipleAccountsInfo(getClientSolana(), lpV2Struct, lpPdas);
};
