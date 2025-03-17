import { ParsedTransactionWithMeta } from '@solana/web3.js';
import {
  BalanceChange,
  Service,
  solanaNativeDecimals,
  solanaNativeWrappedAddress,
  Transaction,
} from '@sonarwatch/portfolio-core';
import { unshift } from './unshift';
import { sortedServices } from '../services';

const findTransactionService = (
  txn: ParsedTransactionWithMeta
): Service | undefined => {
  const { instructions } = txn.transaction.message;

  const txnContractAddresses = instructions
    .map((i) => i.programId.toString())
    .filter((value, index, self) => self.indexOf(value) === index);

  // We keep the first service with all contract addresses in txn
  return sortedServices.find((service) =>
    service.contracts?.every((contract) =>
      txnContractAddresses.includes(contract.address)
    )
  );
};

export const parseTransaction = (
  txn: ParsedTransactionWithMeta | null,
  owner: string
): Transaction | null => {
  if (!txn) return null;

  const { accountKeys } = txn.transaction.message;

  const changes: BalanceChange[] = [];
  if (txn.meta) {
    const { preTokenBalances, postTokenBalances, preBalances, postBalances } =
      txn.meta;

    const ownerIndex = accountKeys.findIndex(
      (accountKey) => accountKey.pubkey.toString() === owner
    );

    if (postBalances[ownerIndex] !== preBalances[ownerIndex]) {
      changes.push({
        address: solanaNativeWrappedAddress,
        preBalance: unshift(preBalances[ownerIndex], solanaNativeDecimals),
        postBalance: unshift(postBalances[ownerIndex], solanaNativeDecimals),
        change: unshift(
          Number(postBalances[ownerIndex]) - Number(preBalances[ownerIndex]),
          solanaNativeDecimals
        ),
      });
    }

    if (preTokenBalances && postTokenBalances) {
      const preTokenBalance = preTokenBalances.find((b) => b.owner === owner);
      const postTokenBalance = postTokenBalances.find((b) => b.owner === owner);
      if (preTokenBalance && postTokenBalance) {
        const preBalanceAmount = preTokenBalance
          ? unshift(
              preTokenBalance.uiTokenAmount.amount,
              preTokenBalance.uiTokenAmount.decimals
            )
          : 0;
        const postBalanceAmount = postTokenBalance
          ? unshift(
              postTokenBalance.uiTokenAmount.amount,
              postTokenBalance.uiTokenAmount.decimals
            )
          : 0;
        if (postBalanceAmount !== preBalanceAmount) {
          changes.push({
            address: postTokenBalance.mint,
            preBalance: preBalanceAmount,
            postBalance: postBalanceAmount,
            change: postBalanceAmount - preBalanceAmount,
          });
        }
      }
    }
  }

  return {
    signature: txn.transaction.signatures[0],
    owner,
    blockTime: txn.blockTime,
    service: findTransactionService(txn),
    balanceChanges: changes,
    isSigner: accountKeys.some(
      (accountKey) =>
        accountKey.pubkey.toString() === owner && accountKey.signer
    ),
    success: !txn.meta?.err,
  };
};
