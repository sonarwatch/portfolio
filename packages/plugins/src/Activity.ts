import {
  Service,
  Transaction,
  BalanceChange,
  solanaNativeWrappedAddress,
  solanaNativeDecimals,
} from '@sonarwatch/portfolio-core';
import { VersionedTransactionResponse } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from './Cache';
import promiseTimeout from './utils/misc/promiseTimeout';
import { getClientSolana } from './utils/clients';
import { services } from './index';

const runActivityTimeout = 60000;

const parseVersionedTransaction = (
  txn: VersionedTransactionResponse | null,
  sortedServices: Service[]
) => {
  if (!txn) return null;
  const { staticAccountKeys } = txn.transaction.message;

  // console.log(JSON.stringify(txn));

  const changes: BalanceChange[] = [];
  if (txn.meta) {
    const { preTokenBalances, postTokenBalances, preBalances, postBalances } =
      txn.meta;
    if (preTokenBalances && postTokenBalances) {
      changes.push({
        address: solanaNativeWrappedAddress,
        preBalance: new BigNumber(preBalances[0])
          .dividedBy(10 ** solanaNativeDecimals)
          .toNumber(),
        postBalance: new BigNumber(postBalances[0])
          .dividedBy(10 ** solanaNativeDecimals)
          .toNumber(),
        change: new BigNumber(postBalances[0])
          .minus(preBalances[0])
          .dividedBy(10 ** solanaNativeDecimals)
          .toNumber(),
      });

      const maxAccountIndex = Math.max(
        preTokenBalances[preTokenBalances.length - 1].accountIndex,
        postTokenBalances[postTokenBalances.length - 1].accountIndex
      );

      for (let i = 0; i <= maxAccountIndex; i++) {
        const preTokenBalance = preTokenBalances.find(
          (balance) =>
            balance.accountIndex === i &&
            balance.owner === staticAccountKeys[0].toString()
        );
        const postTokenBalance = postTokenBalances.find(
          (balance) =>
            balance.accountIndex === i &&
            balance.owner === staticAccountKeys[0].toString()
        );
        if (!preTokenBalance || !postTokenBalance) continue;
        const preBalance = preTokenBalance.uiTokenAmount.uiAmount || 0;
        const postBalance = postTokenBalance.uiTokenAmount.uiAmount || 0;
        changes.push({
          address: postTokenBalance.mint,
          preBalance,
          postBalance,
          change: postBalance - preBalance,
        });
      }
    }
  }

  return {
    signature: txn.transaction.signatures[0],
    blockTime: txn.blockTime,
    service: getService(txn, sortedServices),
    balanceChanges: changes,
  } as Transaction;
};

const getService = (
  txn: VersionedTransactionResponse,
  sortedServices: Service[]
): Service | undefined => {
  const { compiledInstructions, staticAccountKeys } = txn.transaction.message;

  const txnContractAddresses = compiledInstructions
    .map((i) => staticAccountKeys[i.programIdIndex].toString())
    .filter((value, index, self) => self.indexOf(value) === index);

  console.log(txnContractAddresses);

  // We keep the first service with all contract addresses in txn
  return sortedServices.find((service) =>
    service.contracts?.every((contract) =>
      txnContractAddresses.includes(contract.address)
    )
  );
};

const testTxns = [
  'JBEufKsoiAgJUTa1u9iUqVuRRq43pDhLmMD1QtkXEdqDYgRrR7kKzFuGS1FaZ93cNmnvbtDp2Yf9uDRZ9815B3f', // defituna deposit
  'PUaJ8qmoN6r4XdE3Jir4PWZQ16xmi7J6uQATigcjU6ujLX1A44vjQsUSXL8mMMbYBoDKJCu2GtdxWLjW7aAXu4n', // kamino lend deposit
  '29Jp6GY7PKMmTsuGAG664Qf2Uu9p1Z8QmA9jyepBkcbR2QuviNw3hna9qPs7HWEs4jNWPim4by55hbHWdDht1tHD', // kamino multiply withdraw
  'EFa91iksec28yrN1XxjWb22u5zn1U3DTB57B4KTwiR5swNubpU1X4ryjQHccVAfmFtY1PzQmryUneSKmeKm3wkf', // kamino farms
];

export async function runActivity(owner: string, cache: Cache) {
  const client = getClientSolana();

  const sortedServices = services.sort(
    (a, b) => (b.contracts?.length || 0) - (a.contracts?.length || 0)
  );

  const activityPromise = Promise.all(
    testTxns.map(async (txn) =>
      client
        .getTransaction(txn, {
          maxSupportedTransactionVersion: 1,
        })
        .then((t) => parseVersionedTransaction(t, sortedServices))
    )
  );

  return promiseTimeout(
    activityPromise,
    runActivityTimeout,
    `Activity timed out`
  );
}
