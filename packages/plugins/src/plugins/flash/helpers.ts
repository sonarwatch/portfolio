import {
  AccountMeta,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from '@solana/web3.js';
import axios, { AxiosResponse } from 'axios';
import { flashPerpetuals, flashPid, poolsPkeys } from './constants';
import { SolanaClient } from '../../utils/clients/types';
import { anchorSighash } from '../../utils/solana/anchorSighash';
import { FLPool } from './structs';
import {
  emptyWithSol,
  ParsedAccount,
  u64,
  usdcSolanaDecimals,
} from '../../utils/solana';
import { Prefix } from './types';

export function getPdas(owner: string) {
  return poolsPkeys.map(
    (key) =>
      PublicKey.findProgramAddressSync(
        [
          Buffer.from('stake', 'utf8'),
          new PublicKey(owner).toBuffer(),
          key.toBuffer(),
        ],
        flashPid
      )[0]
  );
}

export async function getLpTokenPrice(
  connection: SolanaClient,
  pool: ParsedAccount<FLPool>,
  oracles: string[],
  method: 'getCompoundingTokenPrice' | 'getLpTokenPrice'
) {
  const keys: AccountMeta[] = [
    {
      pubkey: flashPerpetuals,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: pool.pubkey,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: pool.flpMint,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_INSTRUCTIONS_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
    ...pool.custodies.map((c) => ({
      pubkey: c,
      isSigner: false,
      isWritable: false,
    })),
    ...oracles.map((o) => ({
      pubkey: new PublicKey(o),
      isSigner: false,
      isWritable: false,
    })),
    ...pool.markets.map((m) => ({
      pubkey: m,
      isSigner: false,
      isWritable: false,
    })),
  ];
  const data = Buffer.concat([anchorSighash('global', method)]);
  const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const prefixResponse: AxiosResponse<Prefix> = await axios.get(
    `https://api.prod.flash.trade/backup-oracle/prices?poolAddress=${pool.pubkey.toString()}`
  );
  if (!prefixResponse.data) return null;

  const addressLookupTable = (
    await connection.getAddressLookupTable(
      new PublicKey('4E5u7DBVrJp6tVaWkH1sr6r9hhkFwGWmhEHrHeTNDdnP')
    )
  ).value;

  if (!addressLookupTable) return null;

  const messageV0 = new TransactionMessage({
    payerKey: new PublicKey(emptyWithSol),
    recentBlockhash,
    instructions: [
      new TransactionInstruction({
        keys: prefixResponse.data.keys,
        programId: new PublicKey(prefixResponse.data.programId),
        data: Buffer.from(prefixResponse.data.data),
      }),
      new TransactionInstruction({
        keys,
        programId: flashPid,
        data,
      }),
    ],
  }).compileToV0Message([addressLookupTable]);
  const versionedTransaction = new VersionedTransaction(messageV0);
  const simulatedTransactionResponse = await connection.simulateTransaction(
    versionedTransaction
  );

  const returnedData = simulatedTransactionResponse.value.returnData?.data[0];
  if (returnedData)
    return u64
      .read(Buffer.from(returnedData, 'base64'), 0)
      .div(10 ** usdcSolanaDecimals)
      .toNumber();

  return null;
}
