import { ParsedTransactionWithMeta } from '@solana/web3.js';
import {
  AccountChanges,
  BalanceChange,
  solanaNativeAddress,
  solanaNativeDecimals,
  Transaction,
  TransactionTag,
} from '@sonarwatch/portfolio-core';
import { unshift } from './unshift';
import { getTransactionService } from './parseTransaction/getTransactionService';
import { transactionContainsJitotip } from './parseTransaction/transactionContainsJitotip';
import { transactionIsSpam } from './parseTransaction/transactionIsSpam';

const getAccountChanges = (txn: ParsedTransactionWithMeta): AccountChanges => {
  const accountChanges: AccountChanges = {
    created: [],
    updated: [],
    closed: [],
  };

  if (txn.meta) {
    const { preBalances, postBalances } = txn.meta;
    const { accountKeys } = txn.transaction.message;

    preBalances.forEach((preBalance, i) => {
      if (preBalance === 0 && postBalances[i] > 0) {
        accountChanges.created.push(accountKeys[i].pubkey.toString());
      } else if (preBalance > 0 && postBalances[i] === 0) {
        accountChanges.closed.push(accountKeys[i].pubkey.toString());
      } else if (accountKeys[i].writable && !accountKeys[i].signer) {
        accountChanges.updated.push(accountKeys[i].pubkey.toString());
      }
    });
  }

  return accountChanges;
};

const getBalanceChanges = (
  txn: ParsedTransactionWithMeta,
  owner: string
): BalanceChange[] => {
  const changes: BalanceChange[] = [];
  if (txn.meta) {
    const { accountKeys } = txn.transaction.message;
    const { preTokenBalances, postTokenBalances, preBalances, postBalances } =
      txn.meta;

    const ownerIndex = accountKeys.findIndex(
      (accountKey) => accountKey.pubkey.toString() === owner
    );

    if (postBalances[ownerIndex] !== preBalances[ownerIndex]) {
      changes.push({
        address: solanaNativeAddress,
        preBalance: unshift(preBalances[ownerIndex], solanaNativeDecimals),
        postBalance: unshift(postBalances[ownerIndex], solanaNativeDecimals),
        change: unshift(
          Number(postBalances[ownerIndex]) - Number(preBalances[ownerIndex]),
          solanaNativeDecimals
        ),
      });
    }

    if (preTokenBalances && postTokenBalances) {
      accountKeys.forEach((accountKey, i) => {
        const preTokenBalance = preTokenBalances.find(
          (b) => b.accountIndex === i && b.owner === owner
        );
        const postTokenBalance = postTokenBalances.find(
          (b) => b.accountIndex === i && b.owner === owner
        );

        if (preTokenBalance || postTokenBalance) {
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
            const address = postTokenBalance
              ? postTokenBalance.mint
              : preTokenBalance?.mint;
            if (address)
              changes.push({
                address,
                preBalance: preBalanceAmount,
                postBalance: postBalanceAmount,
                change: postBalanceAmount - preBalanceAmount,
              });
          }
        }
      });
    }
  }

  return changes;
};

const ownerIsSigner = (
  txn: ParsedTransactionWithMeta,
  owner: string
): boolean =>
  txn.transaction.message.accountKeys.some(
    (accountKey) => accountKey.pubkey.toString() === owner && accountKey.signer
  );

export const parseTransaction = (
  txn: ParsedTransactionWithMeta | null,
  owner: string
): Transaction | null => {
  if (!txn) return null;

  const isSigner = ownerIsSigner(txn, owner);

  const tags: TransactionTag[] = [];
  if (transactionContainsJitotip(txn)) {
    tags.push('jitotip');
  }
  if (transactionIsSpam(txn, isSigner)) {
    tags.push('spam');
  }

  return {
    signature: txn.transaction.signatures[0],
    owner,
    blockTime: txn.blockTime,
    service: getTransactionService(txn),
    balanceChanges: getBalanceChanges(txn, owner),
    accountChanges: getAccountChanges(txn),
    isSigner,
    tags,
    fees:
      isSigner && txn.meta?.fee
        ? unshift(txn.meta.fee, solanaNativeDecimals)
        : null,
    success: !txn.meta?.err,
  };
};
