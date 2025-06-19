import { PublicKey } from '@solana/web3.js';
import {
  getSignatures,
  getTransactions,
  parseTransaction,
} from '@sonarwatch/tx-parser';
import { Claim, ClientType } from '@sonarwatch/portfolio-core';
import { getClientSolana } from '../../clients';

export const getClaimTransactions = async (
  owner: PublicKey | string,
  claimStatusPk: PublicKey | string,
  mint: PublicKey | string
): Promise<Claim[]> => {
  const client = getClientSolana({ clientType: ClientType.FAST_LIMITED });

  const signatures = await getSignatures(client, claimStatusPk.toString());
  const transactions = await getTransactions(
    client,
    signatures.map((s) => s.signature)
  );
  const parsedTransactions = transactions.map((t) =>
    parseTransaction(t, owner.toString())
  );
  return parsedTransactions
    .map((transaction) => {
      if (!transaction?.blockTime) return null;
      const balanceChange = transaction.balanceChanges.find(
        (bc) => bc.address === mint.toString()
      );
      if (!balanceChange) return null;

      return {
        date: transaction.blockTime * 1000,
        amount: balanceChange.change,
        txId: transaction.signature,
      } as Claim;
    })
    .filter((c) => c !== null) as Claim[];
};
