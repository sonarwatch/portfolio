import { NetworkId } from '@sonarwatch/portfolio-core';
import { SuiClient } from '@mysten/sui/client';
import { ObjectRef, Transaction } from '@mysten/sui/transactions';
import { normalizeStructTag } from '@mysten/sui/utils';
import { Cache } from '../../../Cache';
import {
  addressKey,
  addressPrefix,
  poolAddressKey,
  poolAddressPrefix,
} from '../constants';
import {
  PoolAddressMap,
  type AddressInfo,
  type BorrowIncentiveAccounts,
  type BorrowIncentiveAccountsQueryInterface,
  type BorrowIncentiveAccountFields,
  type BorrowIncentiveAccountPointFields,
  type ParsedBorrowIncentiveAccountData,
  type ParsedBorrowIncentiveAccountPoolData,
} from '../types';

const parseBorrowIncentiveAccountPoolPointData = (
  accountPoint: BorrowIncentiveAccountPointFields
): ParsedBorrowIncentiveAccountPoolData => ({
  pointType: normalizeStructTag(accountPoint.point_type.name),
  weightedAmount: Number(accountPoint.weighted_amount),
  points: Number(accountPoint.points),
  totalPoints: Number(accountPoint.total_points),
  index: Number(accountPoint.index),
});

const parseBorrowIncentiveAccountData = (
  borrowIncentiveAccount: BorrowIncentiveAccountFields
): ParsedBorrowIncentiveAccountData => ({
  poolType: normalizeStructTag(borrowIncentiveAccount.pool_type.name),
  debtAmount: Number(borrowIncentiveAccount.debt_amount),
  pointList: borrowIncentiveAccount.points_list.map((point) =>
    parseBorrowIncentiveAccountPoolPointData(point)
  ),
});

const queryBorrowIncentiveAccounts = async (
  cache: Cache,
  client: SuiClient,
  {
    sender,
    obligation,
  }: {
    sender: string;
    obligation: string | ObjectRef;
  }
): Promise<BorrowIncentiveAccounts | undefined> => {
  const [addressData, poolAddress] = await Promise.all([
    cache.getItem<AddressInfo>(addressKey, {
      prefix: addressPrefix,
      networkId: NetworkId.sui,
    }),
    cache.getItem<PoolAddressMap>(poolAddressKey, {
      prefix: poolAddressPrefix,
      networkId: NetworkId.sui,
    }),
  ]);

  if (!addressData || !poolAddress) return undefined;

  const { query: queryPkgId, incentiveAccounts } =
    addressData.mainnet.borrowIncentive;
  const txb = new Transaction();

  const target = `${queryPkgId}::incentive_account_query::incentive_account_data`;
  const args = [
    txb.object(incentiveAccounts),
    typeof obligation === 'string'
      ? txb.object(obligation)
      : txb.objectRef(obligation),
  ];

  txb.moveCall({
    target,
    arguments: args,
    typeArguments: [],
  });

  const queryResult = await client.devInspectTransactionBlock({
    transactionBlock: txb,
    sender,
  });
  const borrowIncentiveAccountsQueryData = queryResult?.events[0]
    ?.parsedJson as BorrowIncentiveAccountsQueryInterface | undefined;

  const borrowIncentiveAccounts: BorrowIncentiveAccounts = Object.values(
    borrowIncentiveAccountsQueryData?.pool_records ?? []
  ).reduce((acc, accountData) => {
    const parsedBorrowIncentiveAccount =
      parseBorrowIncentiveAccountData(accountData);
    const { poolType, debtAmount } = parsedBorrowIncentiveAccount;
    if (debtAmount === 0) return acc;

    acc[poolType] = parsedBorrowIncentiveAccount;
    return acc;
  }, {} as BorrowIncentiveAccounts);

  return borrowIncentiveAccounts;
};

export default queryBorrowIncentiveAccounts;
