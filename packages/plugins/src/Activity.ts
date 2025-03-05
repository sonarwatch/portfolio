import {
  Service,
  Transaction,
  BalanceChange,
  solanaNativeWrappedAddress,
  solanaNativeDecimals,
  NetworkIdType,
  NetworkId,
} from '@sonarwatch/portfolio-core';
import { ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Cache } from './Cache';
import promiseTimeout from './utils/misc/promiseTimeout';
import { getClientSolana } from './utils/clients';
import { ServiceDirectory } from './utils/directories/serviceDirectory';

const runActivityTimeout = 60000;

const parseVersionedTransaction = (
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
    service: getService(txn, sortedServices),
    balanceChanges: changes,
    isSigner: accountKeys.some(
      (accountKey) =>
        accountKey.pubkey.toString() === owner && accountKey.signer
    ),
  };
};

const getService = (
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

/* const testTxns = [
  'JBEufKsoiAgJUTa1u9iUqVuRRq43pDhLmMD1QtkXEdqDYgRrR7kKzFuGS1FaZ93cNmnvbtDp2Yf9uDRZ9815B3f', // defituna deposit
  'PUaJ8qmoN6r4XdE3Jir4PWZQ16xmi7J6uQATigcjU6ujLX1A44vjQsUSXL8mMMbYBoDKJCu2GtdxWLjW7aAXu4n', // kamino lend deposit
  '29Jp6GY7PKMmTsuGAG664Qf2Uu9p1Z8QmA9jyepBkcbR2QuviNw3hna9qPs7HWEs4jNWPim4by55hbHWdDht1tHD', // kamino multiply withdraw
  'EFa91iksec28yrN1XxjWb22u5zn1U3DTB57B4KTwiR5swNubpU1X4ryjQHccVAfmFtY1PzQmryUneSKmeKm3wkf', // kamino farms
]; */

export async function runActivity(
  cache: Cache,
  network: NetworkIdType,
  owner: string,
  account?: string
) {
  if (network !== NetworkId.solana) {
    throw new Error(`Unsupported Network ${network}`);
  }
  const client = getClientSolana();

  const sortedServices = await ServiceDirectory.getServices();

  const activityPromise = client
    .getSignaturesForAddress(
      new PublicKey(account || owner),
      { limit: 10 },
      'confirmed'
    )
    .then((signatures) =>
      client.getParsedTransactions(
        signatures.map((s) => s.signature),
        {
          maxSupportedTransactionVersion: 0,
        }
      )
    )
    .then((parsedTransactions) =>
      parsedTransactions.map((t) =>
        parseVersionedTransaction(t, owner, sortedServices)
      )
    );

  return promiseTimeout(
    activityPromise,
    runActivityTimeout,
    `Activity timed out`
  );
}
