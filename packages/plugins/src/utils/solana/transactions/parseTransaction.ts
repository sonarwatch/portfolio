import { ParsedTransactionWithMeta } from '@solana/web3.js';
import {
  BalanceChange,
  Service,
  solanaNativeDecimals,
  solanaNativeWrappedAddress,
  Transaction,
} from '@sonarwatch/portfolio-core';
import BigNumber from 'bignumber.js';

const findTransactionService = (
  txn: ParsedTransactionWithMeta,
  sortedServices: Service[]
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
  owner: string,
  sortedServices: Service[]
): Transaction | null => {
  if (!txn) return null;
  if (txn.meta?.err) return null;

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
        preBalance: new BigNumber(preBalances[ownerIndex])
          .shiftedBy(-solanaNativeDecimals)
          .toNumber(),
        postBalance: new BigNumber(postBalances[ownerIndex])
          .shiftedBy(-solanaNativeDecimals)
          .toNumber(),
        change: new BigNumber(postBalances[ownerIndex])
          .minus(preBalances[ownerIndex])
          .shiftedBy(-solanaNativeDecimals)
          .toNumber(),
      });
    }

    if (preTokenBalances && postTokenBalances) {
      const preTokenBalance = preTokenBalances.find((b) => b.owner === owner);
      const postTokenBalance = postTokenBalances.find((b) => b.owner === owner);
      if (preTokenBalance && postTokenBalance) {
        const preBalanceAmount = preTokenBalance
          ? new BigNumber(preTokenBalance.uiTokenAmount.amount).shiftedBy(
              -preTokenBalance.uiTokenAmount.decimals
            )
          : new BigNumber(0);
        const postBalanceAmount = postTokenBalance
          ? new BigNumber(postTokenBalance.uiTokenAmount.amount).shiftedBy(
              -postTokenBalance.uiTokenAmount.decimals
            )
          : new BigNumber(0);
        if (!postBalanceAmount.isEqualTo(preBalanceAmount)) {
          changes.push({
            address: postTokenBalance.mint,
            preBalance: preBalanceAmount.toNumber(),
            postBalance: postBalanceAmount.toNumber(),
            change: postBalanceAmount.minus(preBalanceAmount).toNumber(),
          });
        }
      }
    }
  }

  return {
    signature: txn.transaction.signatures[0],
    blockTime: txn.blockTime,
    service: findTransactionService(txn, sortedServices),
    balanceChanges: changes,
    isSigner: accountKeys.some(
      (accountKey) =>
        accountKey.pubkey.toString() === owner && accountKey.signer
    ),
  };
};
