import { getClientSolana } from '../../utils/clients';
import { ParsedGpa } from '../../utils/solana/beets/ParsedGpa';
import {
  BalanceWithBank,
  MarginfiAccount,
  marginfiAccountStruct,
} from './structs/MarginfiAccount';
import {
  MarginfiAccountAddress,
  marginFiBanksMemo,
  marginfiProgramId,
} from './constants';
import { Cache } from '../../Cache';
import { ParsedAccount } from '../../utils/solana';

export const getMarginFiAccounts = async (
  authority: string,
  cache: Cache
): Promise<
  (
    | (ParsedAccount<MarginfiAccount> & {
        balances: (BalanceWithBank | null)[];
      })
    | null
  )[]
> => {
  const client = getClientSolana();
  const accounts = await ParsedGpa.build(
    client,
    marginfiAccountStruct,
    marginfiProgramId
  )
    .addRawFilter(0, 'CKkRR4La3xu')
    .addRawFilter(8, MarginfiAccountAddress)
    .addRawFilter(40, authority)
    .run();

  if (accounts.length === 0) return [];

  const banksInfoByAddress = await marginFiBanksMemo.getItem(cache);
  if (!banksInfoByAddress) throw new Error('MarginFi banks not cached');

  return accounts.map((marginfiAccount) => {
    const { balances } = marginfiAccount.lendingAccount;
    if (!balances || balances.length === 0) return null;

    return {
      ...marginfiAccount,
      balances: balances.map((balance) => {
        if (balance.bankPk.toString() === '11111111111111111111111111111111')
          return null;

        const bank = banksInfoByAddress.get(balance.bankPk.toString());
        if (!bank) return null;

        return {
          ...balance,
          bank,
        } as BalanceWithBank;
      }),
    };
  });
};
