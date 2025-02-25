import { Connection } from '@solana/web3.js';
import {
  earnLenderDataSize,
  earnVaultDataSize,
  leverageObligationDataSize,
  leverageVaultDataSize,
  plutoProgramId,
} from './constants';
import { getParsedProgramAccounts, ParsedAccount } from '../../utils/solana';
import {
  EarnLender,
  earnLenderBeet,
  LeverageObligation,
  leverageObligationBeet,
  VaultEarn,
  vaultEarnBeet,
  VaultLeverage,
  vaultLeverageBeet,
} from './structs';
import { getClientSolana } from '../../utils/clients';

export async function getVaultEarns(): Promise<ParsedAccount<VaultEarn>[]> {
  return getParsedProgramAccounts(
    getClientSolana(),
    vaultEarnBeet,
    plutoProgramId,
    [
      {
        memcmp: {
          bytes: 'jfWK214iQVV',
          offset: 0,
        },
      },
      {
        dataSize: earnVaultDataSize,
      },
    ]
  );
}

export async function getLenders(
  conn: Connection,
  owner: string
): Promise<ParsedAccount<EarnLender>[]> {
  return getParsedProgramAccounts(conn, earnLenderBeet, plutoProgramId, [
    {
      memcmp: {
        bytes: 'JvCR7VD2GeP',
        offset: 0,
      },
    },
    {
      dataSize: earnLenderDataSize,
    },
    {
      memcmp: {
        offset: 16,
        bytes: owner,
      },
    },
  ]);
}

export async function getAllLeverage(): Promise<
  ParsedAccount<VaultLeverage>[]
> {
  return getParsedProgramAccounts(
    getClientSolana(),
    vaultLeverageBeet,
    plutoProgramId,
    [
      {
        memcmp: {
          bytes: 'Pgkecis23EJ',
          offset: 0,
        },
      },
      {
        dataSize: leverageVaultDataSize,
      },
    ]
  );
}

export async function getLeverageObligations(
  conn: Connection,
  owner: string
): Promise<ParsedAccount<LeverageObligation>[]> {
  return getParsedProgramAccounts(
    conn,
    leverageObligationBeet,
    plutoProgramId,
    [
      {
        memcmp: {
          bytes: 'VEdzkJnDweW',
          offset: 0,
        },
      },
      {
        dataSize: leverageObligationDataSize,
      },
      {
        memcmp: {
          offset: 16,
          bytes: owner,
        },
      },
    ]
  );
}
