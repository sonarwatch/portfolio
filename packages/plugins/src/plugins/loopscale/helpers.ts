import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { getMarginFiAccounts } from '../marginfi/getMarginFiAccounts';
import { Cache } from '../../Cache';
import { wrappedI80F48toBigNumber } from '../marginfi/helpers';
import {
  MarginfiAccountAddress,
  marginFiBanksMemo,
  marginfiProgramId,
} from '../marginfi/constants';

export const getProgramAddress = (
  seeds: (Uint8Array | Buffer)[],
  programId: PublicKey
) => {
  const [key] = PublicKey.findProgramAddressSync(seeds, programId);
  return key;
};

export function bytesToNumberLE(bytes: Uint8Array): number {
  let result = BigInt(0);
  for (let i = bytes.length - 1; i >= 0; i--) {
    // eslint-disable-next-line no-bitwise
    result = (result << BigInt(8)) | BigInt(bytes[i]);
  }

  return Number(result);
}

export async function getMarginFiAccountBalance(
  account: PublicKey,
  cache: Cache
) {
  const marginFiAccounts = await getMarginFiAccounts(
    account.toString(),
    {
      group: MarginfiAccountAddress,
      pid: marginfiProgramId,
      memo: marginFiBanksMemo,
    },
    cache
  );

  let accountBalance = 0;
  marginFiAccounts.forEach((acc) => {
    if (!acc) return;
    acc.balances.forEach((balance) => {
      if (!balance) return;
      const shareBalance = wrappedI80F48toBigNumber(balance.assetShares);

      const { bank } = balance;
      if (bank !== undefined) {
        const shareValue = wrappedI80F48toBigNumber({
          value: new BigNumber(bank.assetShareValue.value),
        });
        const totalValue = shareBalance.multipliedBy(shareValue);
        accountBalance += totalValue.toNumber();
      }
    });
  });
  return accountBalance;
}
