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
  txn: VersionedTransactionResponse | null
) => {
  if (!txn) return null;
  const { compiledInstructions, staticAccountKeys } = txn.transaction.message;

  // console.log(JSON.stringify(txn));

  const txnContracts = compiledInstructions.map((i) =>
    staticAccountKeys[i.programIdIndex].toString()
  );

  const candidatesServices = services.filter((service) =>
    service.configs.find((config) =>
      config.contracts?.find((contract) =>
        txnContracts.includes(contract.address)
      )
    )
  );

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
    services: applyServicesRules(candidatesServices, txn),
    balanceChanges: changes,
  } as Transaction;
};

const applyServicesRules = (
  candidatesServices: Service[],
  txn: VersionedTransactionResponse
) => {
  if (candidatesServices.length < 2) return candidatesServices;

  const serviceIds = candidatesServices.map((c) => c.id);

  // DefiTuna
  if (serviceIds.includes('defituna-liquidity')) {
    return [candidatesServices.find((s) => s.id === 'defituna-liquidity')];
  }

  return candidatesServices;
};

export async function runActivity(owner: string, cache: Cache) {
  const client = getClientSolana();

  const activityPromise = client
    .getTransaction(
      'JBEufKsoiAgJUTa1u9iUqVuRRq43pDhLmMD1QtkXEdqDYgRrR7kKzFuGS1FaZ93cNmnvbtDp2Yf9uDRZ9815B3f', // defituna
      {
        maxSupportedTransactionVersion: 1,
      }
    )
    .then(parseVersionedTransaction);

  return promiseTimeout(
    activityPromise,
    runActivityTimeout,
    `Activity timed out`
  );
}
