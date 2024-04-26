import BigNumber from 'bignumber.js';
import {
  Profile,
  ProfileBorrowItem,
  ProfileDepositItem,
  ProfileVec,
  Reserve,
} from './types';
import { AptosClient } from '../../utils/clients/types';
import { getTableItem } from '../../utils/aptos';
import { packageId } from './constants';

export function getName(accountName: string) {
  if (accountName.startsWith('profile')) return accountName.slice(7);
  return accountName;
}

function hex2a(hex: string) {
  let hexx = hex;
  if (hex.startsWith('0x')) hexx = hexx.slice(2);

  let str = '';
  for (let i = 0; i < hexx.length; i += 2)
    str += String.fromCharCode(parseInt(hexx.substring(i, i + 2), 16));
  return str;
}

function getTokenAddress(vec: ProfileVec) {
  return `${vec.account_address}::${hex2a(vec.module_name)}::${hex2a(
    vec.struct_name
  )}`;
}

export function getBorrowApr(
  utilization: BigNumber,
  borrowedAmount: BigNumber,
  availableAmount: BigNumber,
  reserveData: Reserve
): number {
  const interestRateConfig = reserveData.value.interest_rate_config;
  const optimalUtilization = interestRateConfig.optimal_utilization / 100;
  const optimalRate = interestRateConfig.optimal_borrow_rate / 100;
  const minRate = interestRateConfig.min_borrow_rate / 100;
  const maxRate = interestRateConfig.max_borrow_rate / 100;

  if (borrowedAmount.isZero()) return minRate;
  if (availableAmount.isZero()) return maxRate;

  if (utilization.isLessThan(optimalUtilization)) {
    const utilizationDelta = utilization;
    const utilStepsDelta = optimalUtilization;
    return utilizationDelta
      .dividedBy(utilStepsDelta)
      .times(optimalRate)
      .toNumber();
  }
  const utilizationDelta = utilization.minus(optimalUtilization);
  const utilStepsDelta = BigNumber(1).minus(optimalUtilization);
  return utilizationDelta
    .dividedBy(utilStepsDelta)
    .times(maxRate)
    .plus(optimalRate)
    .toNumber();
}

export function getDepositApr(
  utilization: BigNumber,
  borrowApr: number,
  reserveData: Reserve
): number {
  return BigNumber(borrowApr)
    .times(1 - Number(reserveData.value.reserve_config.reserve_ratio) / 10 ** 2)
    .times(utilization)
    .toNumber();
}

export async function getProfileAmounts(
  profile: Profile | null,
  client: AptosClient
) {
  const [deposits, borrows] = await Promise.all([
    getProfileDeposits(profile, client),
    getProfileBorrows(profile, client),
  ]);
  return {
    deposits,
    borrows,
  };
}

export async function getProfileBorrows(
  profile: Profile | null,
  client: AptosClient
) {
  const head = profile?.borrowed_reserves.head.vec.at(0);
  const handle = profile?.borrowed_reserves.inner.inner.handle;
  if (!head || !handle) return [];

  let nextVec: ProfileVec | undefined = head;
  let profileItem: ProfileBorrowItem | null;
  const amounts: { address: string; amount: string }[] = [];
  while (nextVec) {
    profileItem = await getTableItem<ProfileBorrowItem>(client, handle, {
      key_type: '0x1::type_info::TypeInfo',
      value_type: `${packageId}::iterable_table::IterableValue<0x1::type_info::TypeInfo, ${packageId}::profile::Loan>`,
      key: nextVec,
    });
    if (profileItem) {
      amounts.push({
        address: getTokenAddress(nextVec),
        amount: profileItem.val.borrowed_share.val,
      });
    }
    nextVec = profileItem?.next.vec.at(0);
  }
  return amounts;
}

export async function getProfileDeposits(
  profile: Profile | null,
  client: AptosClient
) {
  const head = profile?.deposited_reserves.head.vec.at(0);
  const handle = profile?.deposited_reserves.inner.inner.handle;
  if (!head || !handle) return [];

  let nextVec: ProfileVec | undefined = head;
  let profileItem: ProfileDepositItem | null;
  const amounts: { address: string; amount: string }[] = [];
  while (nextVec) {
    profileItem = await getTableItem<ProfileDepositItem>(client, handle, {
      key_type: '0x1::type_info::TypeInfo',
      value_type: `${packageId}::iterable_table::IterableValue<0x1::type_info::TypeInfo, ${packageId}::profile::Deposit>`,
      key: nextVec,
    });
    if (profileItem) {
      amounts.push({
        address: getTokenAddress(nextVec),
        amount: profileItem.val.collateral_amount,
      });
    }
    nextVec = profileItem?.next.vec.at(0);
  }
  return amounts;
}
